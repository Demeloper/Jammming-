export default function SearchBar({ term, onTermChange, onSearch }) {
    return (
        <section>
            <h2>SearchBar</h2>
            <input 
            value={term}
            onChange={(e) => onTermChange(e.target.value)}
            placeholder="Search songs..."
            />
            <button type="button" onClick={() => onSearch(term)}>
                Search
            </button>    
        </section>
    );
};