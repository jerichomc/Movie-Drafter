import PlayerListEditor from './PlayerListEditor';

function SetupPanel({ state, dispatch }) {
  return (
    // NEW: outer wrapper to center the panel
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: 24,
        padding: 16,
        background: '#121212',
        borderRadius: 12,
      }}
    >
      {/* NEW: inner container with max width */}
      <div style={{ width: '100%', maxWidth: 480 }}>
        <h2 style={{ textAlign: 'center' }}>Setup Draft</h2>

        {/* NEW: draft category input */}
        <div style={{ marginBottom: 12 }}>
          <label>
            Draft category:{' '}
            <input
              type="text"
              placeholder="e.g. Horror Movies"
              value={state.meta.category}
              onChange={(e) =>
                dispatch({
                  type: 'SET_CATEGORY',
                  payload: { category: e.target.value },
                })
              }
              style={{ width: '100%' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            Rounds:{' '}
            <input
              type="number"
              min={1}
              value={state.settings.rounds}
              onChange={(e) =>
                dispatch({
                  type: 'SET_ROUNDS',
                  payload: { rounds: e.target.value },
                })
              }
              style={{ width: 80 }}
            />
          </label>
        </div>

        <PlayerListEditor players={state.players} dispatch={dispatch} />

        <div
          style={{
            display: 'flex',
            gap: 8,
            marginTop: 12,
            justifyContent: 'center', // NEW: center buttons
          }}
        >
          <button
            onClick={() => dispatch({ type: 'RANDOMIZE_DRAFT_ORDER' })}
            disabled={state.players.length < 2}
          >
            Randomize Order
          </button>

          <button
            onClick={() => dispatch({ type: 'START_DRAFT' })}
            disabled={state.players.length < 2}
          >
            Start Draft
          </button>

          <button onClick={() => dispatch({ type: 'RESET_DRAFT' })}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default SetupPanel;
