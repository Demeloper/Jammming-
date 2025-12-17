import Tracklist from '../Tracklist/Tracklist';

export default function SearchResults({ tracks, onAdd }) {
    return (
        <section>
            <h2>Results</h2>
            <Tracklist tracks={tracks} actionLabel="+" onAction={onAdd} />
        </section>
    );
}