function PickCell({ pick, isCurrent, playerName }) {
  const imageUrl = pick.item?.imageUrl;

  return (
    <>
      {isCurrent && (
        <style>
          {`
            @keyframes glowPulse {
              0% {
                box-shadow: 0 0 8px rgba(120, 200, 255, 0.6),
                            0 0 16px rgba(120, 200, 255, 0.4);
              }
              50% {
                box-shadow: 0 0 14px rgba(120, 200, 255, 0.9),
                            0 0 28px rgba(120, 200, 255, 0.6);
              }
              100% {
                box-shadow: 0 0 8px rgba(120, 200, 255, 0.6),
                            0 0 16px rgba(120, 200, 255, 0.4);
              }
            }
          `}
        </style>
      )}

      <div
        style={{
          width: 140,
          height: 210,
          borderRadius: 10,
          overflow: 'hidden',
          background: '#1a1a1a',
          position: 'relative',
          animation: isCurrent ? 'glowPulse 1.6s ease-in-out infinite' : 'none',
          boxShadow: isCurrent
            ? '0 0 12px rgba(120, 200, 255, 0.8)'
            : '1px solid #444',
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={pick.item?.title ?? 'Draft pick'}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
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

        {pick.item && (
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
            }}
          >
            <div
              style={{
                fontWeight: 700,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {pick.item.title}
            </div>
            {pick.item.subtitle && (
              <div style={{ fontSize: 11, opacity: 0.85 }}>
                {pick.item.subtitle}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default PickCell;
