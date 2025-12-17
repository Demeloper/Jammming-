export default function SearchBar({ term, onTermChange }) {
    return (
        <section>
            <h2>SearchBar</h2>
            <input 
            value={term}
            onChange={(e) => onTermChange(e.target.value)}
            placeholder="Search songs..."
            />
            <button type="button">Search</button>    
        </section>
    );
};