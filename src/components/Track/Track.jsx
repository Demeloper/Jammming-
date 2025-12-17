export default function Track({ track, actionLabel, onAction }) {
    return (
        <article>
        <div>
            <h3>{track.name}</h3>
            <p>{track.artist} | {track.album}</p>
        </div>
        <button onClick={() => onAction(track)}>{actionLabel}</button>
        </article>
    );
}