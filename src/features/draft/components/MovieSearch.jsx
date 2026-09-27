import { useEffect, useRef, useState } from 'react';
import { searchMovies, searchPeople } from '../api/tmdb';

function MovieSearch({ onSelect, disabled, draftTarget, personRoleFilter, pickSlots = [], players = [] }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [error, setError] = useState('');

  const containerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const trimmed = query.trim();
    setError('');
    setResults([]);
    setActiveIndex(-1);
    if (!trimmed) {
      setIsLoading(false);
      setResults([]);
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    setIsLoading(true);
    setIsOpen(true);

    const handle = setTimeout(async () => {
      try {
        const data =
          draftTarget === 'person'
            ? await searchPeople(trimmed, personRoleFilter)
            : await searchMovies(trimmed);

        if (cancelled) return;
        setResults(data.slice(0, 8));
        setActiveIndex(-1);
      } catch {
        if (cancelled) return;
        setError('Search couldn’t load. Edit your search to try again.');
        setResults([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [query, draftTarget, personRoleFilter]);

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

  function draftedSlot(item) {
    return pickSlots.find((slot) => slot.item?.tmdbId === item.tmdbId);
  }

  function draftedBy(item) {
    const slot = draftedSlot(item);
    return players.find((player) => player.id === slot?.playerId)?.name || 'another player';
  }

  function chooseItem(item) {
    if (disabled || draftedSlot(item)) return;
    onSelect(item);
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setActiveIndex(-1);
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') {
      setIsOpen(false);
      return;
    }
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = results.findIndex((item, index) => index > activeIndex && !draftedSlot(item));
      if (next !== -1) setActiveIndex(next);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      for (let index = activeIndex - 1; index >= 0; index -= 1) {
        if (!draftedSlot(results[index])) {
          setActiveIndex(index);
          break;
        }
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0) {
        chooseItem(results[activeIndex]);
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
        placeholder={
          disabled
            ? 'Draft finished'
            : draftTarget === 'person'
              ? 'Search a person...'
              : 'Search a movie...'
        }
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.trim() && setIsOpen(true)}
        aria-label={draftTarget === 'person' ? 'Search people' : 'Search movies'}
        onKeyDown={onKeyDown}
        style={{ width: '100%', padding: 10, borderRadius: 8, marginBottom: 4 }}
      />

      {isOpen && query.trim() && (
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
          <div role="status" aria-live="polite">
            {(isLoading || error || results.length === 0) && (
              <div className="search-message">
                {isLoading ? 'Searching…' : error || 'No results found. Try a different name or title.'}
              </div>
            )}
          </div>
          {results.map((item, idx) => (
            <button
              key={item.tmdbId}
              type="button"
              disabled={Boolean(draftedSlot(item))}
              className="search-result"
              onClick={() => chooseItem(item)}
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
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : null}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontWeight: 600 }}>{item.title}</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  {item.subtitle || 'TMDB'}
                </div>
                {draftedSlot(item) && (
                  <div className="search-drafted">Already drafted by {draftedBy(item)}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default MovieSearch;
