import styles from './Track.module.css'
export default function Track({ track, actionLabel, onAction }) {
    return (
        <article className={styles.track}>
        <div className={styles.info}>
            <h3 className={styles.title}>{track.name}</h3>
            <p className={styles.meta}>{track.artist} | {track.album}</p>
        </div>
        <button 
        className={styles.action} 
        type="button"
        onClick={() => onAction(track)}
        >
            {actionLabel}
        </button>
        </article>
    );
}