import Track from '../Track/Track';
import styles from './Tracklist.module.css';

export default function Tracklist({ tracks, actionLabel, onAction }) {
    return (
        <div className={styles.list}>
            {tracks.map((track) => (
                <Track 
                key={track.id} 
                track={track}
                actionLabel={actionLabel}
                onAction={onAction} 
                />
            ))}
        </div>
    );
}