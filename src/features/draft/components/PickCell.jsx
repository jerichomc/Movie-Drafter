function PickCell({ pick, isCurrent, playerName }) {
  const posterUrl = pick.movie?.posterUrl; // NEW: we’ll store this on the movie object later

  return (
    <div
      style={{
        // NEW: poster-tile sizing
        width: 120,
        height: 180,
        borderRadius: 10,
        overflow: 'hidden',

        // NEW: highlight current pick with outline
        outline: isCurrent ? '2px solid #fff' : '1px solid #444',
        background: '#1a1a1a',

        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* NEW: top label strip */}
      <div
        style={{
          padding: '4px 6px',
          fontSize: 11,
          opacity: 0.85,
          background: 'rgba(0,0,0,0.6)',
        }}
      >
        {playerName}
      </div>

      {/* NEW: poster area */}
      <div style={{ flex: 1, position: 'relative' }}>
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={pick.movie?.title ?? 'Movie poster'}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover', // NEW: fills tile like a poster
              display: 'block',
            }}
          />
        ) : (
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              opacity: 0.7,
            }}
          >
            Empty
          </div>
        )}
      </div>
    </div>
  );
}

export default PickCell;

