import { useReducer } from 'react';
import { draftReducer, initialDraftState } from './state/draftReducer';

function DraftPage() {
  // useReducer gives you:
  // 1) state: the current draft data
  // 2) dispatch: a function you call to "send actions" to the reducer
  const [state, dispatch] = useReducer(draftReducer, initialDraftState);

  return (
    <div style={{ padding: 16 }}>
      <h1>Movie Draft</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button
          onClick={() =>
            dispatch({
              type: 'ADD_PLAYER',
              payload: { name: `Player ${state.players.length + 1}` },
            })
          }
        >
          Add Player
        </button>

        <button
          onClick={() =>
            dispatch({
              type: 'SET_ROUNDS',
              payload: { rounds: state.settings.rounds + 1 },
            })
          }
        >
          Rounds +1
        </button>

        <button onClick={() => dispatch({ type: 'RESET_DRAFT' })}>
          Reset
        </button>
      </div>

      <div style={{ marginBottom: 12 }}>
        <strong>Players:</strong> {state.players.length} |{' '}
        <strong>Rounds:</strong> {state.settings.rounds}
      </div>

      {/* Debug view: helps you see state updating while building */}
      <pre style={{ background: '#1b1b1b', padding: 12, borderRadius: 8 }}>
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );
}

export default DraftPage;
