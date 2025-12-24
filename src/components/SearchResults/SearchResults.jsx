import Tracklist from '../Tracklist/Tracklist';
import styles from './searchResults.module.css'; 

export default function SearchResults({ tracks, onAdd }) {
    return (
        <section className={styles.container}>
            <h2 className={styles.headind}>Results</h2>
            <Tracklist tracks={tracks} actionLabel="+" onAction={onAdd} />
        </section>
    );
}