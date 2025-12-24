import Tracklist from '../Tracklist/Tracklist';
import styles from './Playlist.module.css'; 

export default function Playlist({ name, onNameChange, tracks, onRemove, onSave }) {
  return (
    <div className={styles.container}>
        <h2 className={styles.heading}>{name}</h2>
        
      <div className={styles.controls}>
      <input 
        className={styles.input}
        value={name}
        onChange={(e) => onNameChange(e.target.value)} 
        />
        <div className={styles.tracklist}>
        <Tracklist tracks={tracks} actionLabel="-" onAction={onRemove} />
        </div>
        
        <button 
        className={styles.button} 
        type="button"
        onClick={onSave}>Save To Spotify</button>
    </div>
    </div>
  );
}
