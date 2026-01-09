function PickCell({ pick, isCurrent, playerName }) {
  const posterUrl = pick.movie?.posterUrl;

  return (
    <div
      style={{
        // NEW: slightly larger tile (clearer posters)
        width: 140,
        height: 210,

        borderRadius: 10,
        overflow: 'hidden',

        // NEW: use outline for current pick
        outline: isCurrent ? '2px solid #fff' : '1px solid #444',
        background: '#1a1a1a',

        // NEW: allow overlay positioning
        position: 'relative',
      }}
    >
      {/* NEW: poster fills the full tile */}
      {posterUrl ? (
        <img
          src={posterUrl}
          alt={pick.movie?.title ?? 'Movie poster'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover', // fills tile like a poster
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

      {/* NEW: player name overlay (does NOT shrink poster area) */}
      <div
        style={{
          position: 'absolute',
          top: 6,
          left: 6,
          right: 6,
          padding: '4px 6px',
          fontSize: 11,
          borderRadius: 8,
          background: 'rgba(0,0,0,0.6)',
          color: '#fff',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
        title={playerName}
      >
        {playerName}
      </div>
            {/* NEW: movie title overlay (only if picked) */}
      {pick.movie && (
        <div
          style={{
            position: 'absolute',
            left: 6,
            right: 6,
            bottom: 6,
            padding: '6px 8px',
            borderRadius: 8,
            background: 'rgba(0,0,0,0.65)',
            color: '#fff',
            fontSize: 12,
            lineHeight: 1.2,
          }}
          title={`${pick.movie.title}${pick.movie.year ? ` (${pick.movie.year})` : ''}`}
        >
          <div
            style={{
              fontWeight: 700,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {pick.movie.title}
          </div>
          {pick.movie.year && (
            <div style={{ fontSize: 11, opacity: 0.85 }}>
              {pick.movie.year}
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default PickCell;

