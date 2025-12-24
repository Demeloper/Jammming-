import styles from './SearchBar.module.css';

export default function SearchBar({ term, onTermChange, onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(term);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Search</h2>

      <form className={styles.controls} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          value={term}
          onChange={(e) => onTermChange(e.target.value)}
          placeholder="Search songs..."
        />
        <button className={styles.button} type="submit">
          Search
        </button>
      </form>
    </div>
  );
}
