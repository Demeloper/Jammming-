const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

const scopes = [
  "playlist-modify-public",
  "playlist-modify-private",
  "user-read-private",
];

const TOKEN_KEY = "spotify_access_token";
const EXP_KEY = "spotify_token_expires_at";
const VERIFIER_KEY = "spotify_code_verifier";

function base64UrlEncode(bytes) {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return new Uint8Array(await crypto.subtle.digest("SHA-256", data));
}

function randomString(length = 64) {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let text = "";
  for (let i = 0; i < length; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

async function buildChallenge(verifier) {
  const hashed = await sha256(verifier);
  return base64UrlEncode(hashed);
}

function getStoredToken() {
  const token = sessionStorage.getItem(TOKEN_KEY);
  const exp = Number(sessionStorage.getItem(EXP_KEY));
  if (!token || !exp) return null;
  if (Date.now() >= exp) return null;
  return token;
}

export const Spotify = {
  async getAccessToken() {
    // 1) If we already have a valid token, use it
    const existing = getStoredToken();
    if (existing) return existing;

    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    // 2) If we do NOT have a code yet -> redirect user to Spotify login
    if (!code) {
      const verifier = randomString(64);
      sessionStorage.setItem(VERIFIER_KEY, verifier);

      const challenge = await buildChallenge(verifier);

      const authUrl = new URL("https://accounts.spotify.com/authorize");
      authUrl.searchParams.set("client_id", clientId);
      authUrl.searchParams.set("response_type", "code");
      authUrl.searchParams.set("redirect_uri", redirectUri);
      authUrl.searchParams.set("scope", scopes.join(" "));
      authUrl.searchParams.set("code_challenge_method", "S256");
      authUrl.searchParams.set("code_challenge", challenge);

      window.location.assign(authUrl.toString());
      return null; // stops here because page navigates away
    }

    // 3) We have a code -> exchange it for an access token
    const verifier = sessionStorage.getItem(VERIFIER_KEY);

    if (!verifier) {
  // We have a code but lost the verifier (e.g. storage cleared).
  // Reset and restart auth flow.
  url.searchParams.delete("code");
  window.history.replaceState({}, document.title, url.toString());
  return this.getAccessToken();
}

    const body = new URLSearchParams();
    body.set("client_id", clientId);
    body.set("grant_type", "authorization_code");
    body.set("code", code);
    body.set("redirect_uri", redirectUri);
    body.set("code_verifier", verifier);

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Token error", data);
      throw new Error(data.error_description || "Failed to get access token");
    }

    const expiresAt = Date.now() + data.expires_in * 1000;
    sessionStorage.setItem(TOKEN_KEY, data.access_token);
    sessionStorage.setItem(EXP_KEY, String(expiresAt));

    // Clean the URL (remove ?code=...)
    url.searchParams.delete("code");
    window.history.replaceState({}, document.title, url.toString());

    return data.access_token;
  },
  async search(term) {
  if (!term) return [];
  const token = await this.getAccessToken();
  const response = await fetch(
    `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await response.json();
  if (!response.ok) {
    console.error("Search error", data);
    throw new Error(data.error?.message || "Search failed");
  }

  return (data.tracks?.items || []).map(t => ({
    id: t.id,
    name: t.name,
    artist: t.artists?.[0]?.name || "",
    album: t.album?.name || "",
    uri: t.uri,
  }));
},



async getCurrentUserId() {
  const token = await this.getAccessToken();
  const res = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Failed to get user");
  return data.id;
},

async createPlaylist(userId, name) {
  const token = await this.getAccessToken();
  const res = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, public: false }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Failed to create playlist");
  return data.id;
},

async addTracksToPlaylist(playlistId, uris) {
  const token = await this.getAccessToken();


  const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uris }),
  });

  const data = await res.json(); 
  if (!res.ok) throw new Error(data.error?.message || "Failed to add tracks"); 
  return data; 
}, 

async savePlaylist(name, uris) {
  if (!name || uris.length === 0) return;

  const userId = await this.getCurrentUserId();
  const playlistId = await this.createPlaylist(userId, name);
  await this.addTracksToPlaylist(playlistId, uris);
},

};