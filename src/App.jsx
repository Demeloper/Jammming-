import './App.css';
import { useState } from 'react';
import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import Playlist from './components/Playlist/Playlist';

export default function App() {
  const mockTracks = [
    { id: 1, name: 'Song A', artist: 'Artist A', album: 'Album A' },
    { id: 2, name: 'Song B', artist: 'Artist B', album: 'Album B' },
    { id: 3, name: 'Song C', artist: 'Artist C', album: 'Album C' },
  ];
  const [playlistName, setPlaylistName] = useState('My Playlist'); 
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [term, setTerm] = useState('');
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
const savePlaylist = () => {
  const trackIds = playlistTracks.map(t => t.id); 
  console.log({playlistName, tracks: trackIds }); 
  
  setPlaylistName("New Playlist"); 
  setPlaylistTracks([]); 
}; 


const searchResults = mockTracks.filter((track) => {
  const matchesTerm = track.name.toLowerCase().includes(term.toLocaleLowerCase());
  const notInPlaylist = !playlistTracks.some((pt) => pt.id === track.id); 
  return matchesTerm && notInPlaylist; 
});



  return (
    <>
      <h1>Jammming</h1>

      <SearchBar term={term} onTermChange={setTerm}/>

      <SearchResults tracks={searchResults} onAdd={addTrack} />
      
      <Playlist 
        name={playlistName}
        onNameChange={setPlaylistName}
        tracks={playlistTracks}
        onRemove={removeTrack}
        onSave={savePlaylist} 
        />
    </>
  );

}