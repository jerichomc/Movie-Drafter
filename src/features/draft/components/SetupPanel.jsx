import PlayerListEditor from './PlayerListEditor';

function SetupPanel({ state, dispatch }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h2>Setup Draft</h2>

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
          />
        </label>
      </div>

      <PlayerListEditor
        players={state.players}
        dispatch={dispatch}
      />

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button
          onClick={() =>
            dispatch({ type: 'RANDOMIZE_DRAFT_ORDER' })
          }
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
  );
}

export default SetupPanel;
