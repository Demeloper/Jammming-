import styles from './SearchBar.module.css'; 

export default function SearchBar({ term, onTermChange, onSearch }) {
    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Search</h2>
                
        <div className={styles.controls}>
        <input
          className={styles.input}
          value={term}
          onChange={(e) => onTermChange(e.target.value)}
          placeholder="Search songs..."
        />
        <button
          className={styles.button}
          type="button"
          onClick={() => onSearch(term)}
          onClick={() => {
           console.log("SEARCH CLICK term:", term);
            onSearch(term);
}}

        >
          Search
        </button>
      </div>
    </div>
  );
}