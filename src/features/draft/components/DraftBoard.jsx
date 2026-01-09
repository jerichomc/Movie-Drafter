import PickCell from './PickCell';

function DraftBoard({ state }) {
  const { pickSlots, players, currentPickIndex } = state;

  // NEW: group picks by round
  const rounds = {};
  pickSlots.forEach((pick) => {
    if (!rounds[pick.round]) {
      rounds[pick.round] = [];
    }
    rounds[pick.round].push(pick);
  });

  return (
    // NEW: outer wrapper to center the board
    <div
      style={{
        display: 'flex',
        justifyContent: 'center', // centers horizontally
        marginTop: 24,
      }}
    >
      {/* NEW: inner container keeps board width tight */}
      <div>
        <h3 style={{ textAlign: 'center' }}>Draft Board</h3>

        {Object.entries(rounds).map(([roundNumber, picks]) => (
          <div key={roundNumber} style={{ marginBottom: 10 }}>
            <strong>Round {roundNumber}</strong>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${picks.length}, 120px)`,
                gap: 10,
                marginTop: 8,
              }}
            >
              {picks.map((pick) => {
                const player = players.find(
                  (p) => p.id === pick.playerId
                );

                return (
                  <PickCell
                    key={pick.pickIndex}
                    pick={pick}
                    playerName={player?.name}
                    isCurrent={
                      pick.pickIndex === currentPickIndex
                    }
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
