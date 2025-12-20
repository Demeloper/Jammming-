import styles from './App.module.css';
import { useState } from 'react';
import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import Playlist from './components/Playlist/Playlist';
import { Spotify } from './utils/Spotify';

export default function App() {
  const mockTracks = [
    { id: 1, name: 'Song A', artist: 'Artist A', album: 'Album A', uri: "spotify:track:mockA"},
    { id: 2, name: 'Song B', artist: 'Artist B', album: 'Album B', uri: "spotify:track:mockB"},
    { id: 3, name: 'Song C', artist: 'Artist C', album: 'Album C', uri: "spotify:track:mockC"},
  ];
  const [playlistName, setPlaylistName] = useState('My Playlist'); 
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [term, setTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]); 

  //Handler for search

const handleSearch = async (term) => {
  const results = await Spotify.search(term); 
  setSearchResults(results); 
}; 

//ADDING A TRACK 

const addTrack = (track) => {
  setPlaylistTracks((prev) => {
    const alreadyInPlaylist = prev.some((t) => t.id === track.id);
    return alreadyInPlaylist ? prev : [...prev, track]; 
  });
};

//REMOVING A TRACK 

const removeTrack = (track) => {
  setPlaylistTracks((prev) => prev.filter((t) => t.id !== track.id)); 
};

const savePlaylist = async () => {
  const trackUris = playlistTracks.map(t => t.uri);
  await Spotify.savePlaylist(playlistName, trackUris);

  setPlaylistName("New Playlist");
  setPlaylistTracks([]);
};


const displayResults = searchResults.filter(
  (track) => !playlistTracks.some((pt) => pt.id === track.id)
);


console.log("CLIENT ID:", import.meta.env.VITE_SPOTIFY_CLIENT_ID); 
const handleConnect = async () => {
  const token = await Spotify.getAccessToken();
  console.log("TOKEN:", token);
};

  return (
    <div className={styles.app}>
      <header className={styles.header}>  
        <h1 className={styles.title}>Jammming</h1>
        <button className={styles.button} onClick={handleConnect}>
          Connect Spotify
    </button>
    </header>  

    <main className={styles.main}>
      <section className={styles.panel}>
        <SearchBar claaterm={term} onTermChange={setTerm} onSearch={handleSearch} />
        <SearchResults tracks={displayResults} onAdd={addTrack} />
      </section>
    <section className={styles.panel}>
      <Playlist 
        name={playlistName}
        onNameChange={setPlaylistName}
        tracks={playlistTracks}
        onRemove={removeTrack}
        onSave={savePlaylist} 
        />
    </section>  
  </main>
</div> 

);

}