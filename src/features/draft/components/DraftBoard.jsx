import PickCell from './PickCell';

const HOST_COLORS = ['#f4a340', '#56c58c', '#55bbdb', '#bd98e5', '#eb8491'];

function DraftBoard({ state }) {
  const { pickSlots, players, currentPickIndex, draftOrder, status } = state;
  const columnPlayerIds = draftOrder?.length ? draftOrder : players.map((p) => p.id);
  const rounds = [...new Set(pickSlots.map((pick) => pick.round))].sort((a, b) => a - b);
  const getPlayerName = (id) => players.find((p) => p.id === id)?.name ?? 'Player';
  const getPlayerColor = (id) => HOST_COLORS[Math.max(0, players.findIndex((p) => p.id === id)) % HOST_COLORS.length];

  return (
    <div className="draft-board-scroll" role="region" aria-label="Draft board" tabIndex={0}>
      <div className="draft-board" style={{ '--player-count': columnPlayerIds.length }}>
        <div className="draft-board-row draft-board-headers">
          {columnPlayerIds.map((playerId) => (
            <div
              key={playerId}
              className="player-header"
              style={{ '--host-color': getPlayerColor(playerId) }}
              title={getPlayerName(playerId)}
            >
              <span className="player-header-dot" aria-hidden="true" />
              {getPlayerName(playerId)}
            </div>
          ))}
        </div>

        {rounds.map((round) => (
          <section className="draft-round" key={round} aria-label={`Round ${round}`}>
            <div className="round-divider">
              <span className="round-ticket">Round <strong>{String(round).padStart(2, '0')}</strong></span>
              <span className="round-direction">{round % 2 === 1 ? 'Left to right →' : '← Right to left'}</span>
            </div>
            <div className="draft-board-row">
              {columnPlayerIds.map((playerId) => {
                const pick = pickSlots.find((slot) => slot.round === round && slot.playerId === playerId);
                if (!pick) return <div key={playerId} />;
                return (
                  <PickCell
                    key={playerId}
                    pick={pick}
                    playerName={getPlayerName(playerId)}
                    hostColor={getPlayerColor(playerId)}
                    isCurrent={status === 'drafting' && pick.pickIndex === currentPickIndex}
                  />
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export default DraftBoard;
