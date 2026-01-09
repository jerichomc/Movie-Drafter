import PickCell from './PickCell';

function DraftBoard({ state }) {
  const { pickSlots, players, currentPickIndex, draftOrder } = state;

  // NEW: decide the column order (fixed)
  // Prefer draftOrder (randomized order) if it exists; otherwise fall back to players array order.
  const columnPlayerIds =
    draftOrder && draftOrder.length > 0
      ? draftOrder
      : players.map((p) => p.id);

  // NEW: build a quick lookup: round -> (playerId -> pickSlot)
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

        {roundNumbers.map((roundNumber) => (
          <div key={roundNumber} style={{ marginBottom: 24, }}>
            <strong>Round {roundNumber}</strong>

            {/* NEW: consistent columns by player */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columnPlayerIds.length}, 140px)`,
                gap: 16,
                marginTop: 12,
                
              }}
            >
              {columnPlayerIds.map((playerId) => {
                const player = players.find((p) => p.id === playerId);

                // NEW: pull the pick that belongs to this round + player (if any)
                const pick = pickByRoundAndPlayer[roundNumber]?.[playerId];

                // NEW: in case something is missing, show an empty placeholder pick
                const safePick =
                  pick ??
                  {
                    pickIndex: -1,
                    round: roundNumber,
                    playerId,
                    movie: null,
                  };

                return (
                  <PickCell
                    key={`${roundNumber}-${playerId}`}
                    pick={safePick}
                    playerName={player?.name}
                    // NEW: only highlight if this cell is the actual current pick
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
