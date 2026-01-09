import { useEffect, useRef, useState } from 'react';
import { searchMovies } from '../api/tmdb';

// NEW: autocomplete movie search component
function MovieSearch({ onSelect, disabled }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef(null);

  // NEW: debounce TMDB search while typing
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    setIsLoading(true);

    const handle = setTimeout(async () => {
      try {
        const data = await searchMovies(trimmed);
        setResults(data.slice(0, 8)); // keep dropdown tight
        setIsOpen(true);
        setActiveIndex(-1);
      } catch (err) {
        console.error(err);
        setResults([]);
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => clearTimeout(handle);
  }, [query]);

  // NEW: close dropdown on outside click
  useEffect(() => {
    function onDocMouseDown(e) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, []);

  function chooseMovie(movie) {
    onSelect(movie);
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setActiveIndex(-1);
  }

  function onKeyDown(e) {
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0) {
        chooseMovie(results[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', maxWidth: 420 }}>
      <input
        type="text"
        value={query}
        disabled={disabled}
        placeholder={disabled ? 'Draft finished' : 'Search a movie (TMDB)...'}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setIsOpen(true)}
        onKeyDown={onKeyDown}
        style={{ width: '100%', padding: 10, borderRadius: 8 }}
      />

      {isLoading && (
        <div style={{ fontSize: 12, opacity: 0.8, marginTop: 6 }}>
          Searching…
        </div>
      )}

      {isOpen && results.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 44,
            left: 0,
            right: 0,
            background: '#111',
            border: '1px solid #333',
            borderRadius: 10,
            overflow: 'hidden',
            zIndex: 20,
          }}
        >
          {results.map((movie, idx) => (
            <button
              key={movie.tmdbId}
              type="button"
              onClick={() => chooseMovie(movie)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: 10,
                display: 'flex',
                gap: 10,
                alignItems: 'center',
                background: idx === activeIndex ? '#222' : '#111',
                color: '#eee',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 48,
                  background: '#222',
                  flex: '0 0 auto',
                  borderRadius: 4,
                  overflow: 'hidden',
                }}
              >
                {movie.posterUrl ? (
                  <img
                    src={movie.posterUrl}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : null}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontWeight: 600 }}>
                  {movie.title} {movie.year ? `(${movie.year})` : ''}
                </div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>TMDB</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default MovieSearch;
