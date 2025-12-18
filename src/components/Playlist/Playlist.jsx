import Tracklist from '../Tracklist/Tracklist';


export default function Playlist({ name, onNameChange, tracks, onRemove, onSave }) {
  return (
    <section>
        <h2>{name}</h2>
        <input 
        value={name}
        onChange={(e) => onNameChange(e.target.value)} 
        />

        <Tracklist tracks={tracks} actionLabel="-" onAction={onRemove} />
        
        <button onClick={onSave}>Save To Spotify</button>
    </section>
  );
}
