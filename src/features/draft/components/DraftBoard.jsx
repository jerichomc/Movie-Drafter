import PickCell from './PickCell';

function DraftBoard({ state }) {
  const { pickSlots, players, currentPickIndex, draftOrder } = state;

  // NEW: decide the column order (fixed)
  const columnPlayerIds =
    draftOrder && draftOrder.length > 0
      ? draftOrder
      : players.map((p) => p.id);

  // NEW: build a lookup: round -> (playerId -> pickSlot)
  const pickByRoundAndPlayer = {};
  for (const pick of pickSlots) {
    if (!pickByRoundAndPlayer[pick.round]) {
      pickByRoundAndPlayer[pick.round] = {};
    }
    pickByRoundAndPlayer[pick.round][pick.playerId] = pick;
  }

  // NEW: list rounds in numeric order
  const roundNumbers = Object.keys(pickByRoundAndPlayer)
    .map(Number)
    .sort((a, b) => a - b);

  // NEW: helper to get a player name by id (keeps JSX cleaner)
  function getPlayerName(playerId) {
    return players.find((p) => p.id === playerId)?.name ?? 'Player';
  }

  return (
    // NEW: outer wrapper to center the board
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: 24,
      }}
    >
      {/* NEW: inner container keeps board width tight */}
      <div>
        {/* <h3 style={{ textAlign: 'center' }}>Draft Board</h3> */}

        {/* NEW: column headers (fixed player columns) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columnPlayerIds.length}, 140px)`,
            gap: 16,
            marginTop: 10,
            marginBottom: 18,
          }}
        >
          {columnPlayerIds.map((playerId) => (
            <div
              key={`header-${playerId}`}
              style={{
                textAlign: 'center',
                fontWeight: 700,
                padding: '6px 8px',
                borderRadius: 10,
                background: '#121212',
                border: '1px solid #333',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
              title={getPlayerName(playerId)}
            >
              {getPlayerName(playerId)}
            </div>
          ))}
        </div>

        {roundNumbers.map((roundNumber) => (
          <div key={roundNumber} style={{ marginBottom: 24 }}>
            <strong>Round {roundNumber}</strong>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columnPlayerIds.length}, 140px)`,
                gap: 16,
                marginTop: 12,
              }}
            >
              {columnPlayerIds.map((playerId) => {
                const pick = pickByRoundAndPlayer[roundNumber]?.[playerId];

                // NEW: placeholder pick so the cell always exists
                const safePick =
                  pick ?? {
                    pickIndex: -1,
                    round: roundNumber,
                    playerId,
                    movie: null,
                  };

                return (
                  <PickCell
                    key={`${roundNumber}-${playerId}`}
                    pick={safePick}
                    playerName={getPlayerName(playerId)}
                    // NEW: only highlight if this is the actual current pick
                    isCurrent={pick?.pickIndex === currentPickIndex}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DraftBoard;
