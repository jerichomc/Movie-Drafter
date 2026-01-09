import { useReducer } from 'react';
import { draftReducer, initialDraftState } from './state/draftReducer';
import SetupPanel from './components/SetupPanel';

function DraftPage() {
  const [state, dispatch] = useReducer(draftReducer, initialDraftState);

  const currentPick = state.pickSlots[state.currentPickIndex];

  const currentPlayer = state.players.find(
    (p) => p.id === currentPick?.playerId
  );

  return (
    <div style={{ padding: 16 }}>
      <h1>Movie Draft</h1>

      {state.status === 'setup' && (
        <SetupPanel state={state} dispatch={dispatch} />
      )}

      {state.status === 'drafting' && (
        <div>
            <h2>Drafting...</h2>
            <p>
                Round {currentPick.round} -{' '}
                <strong>{currentPlayer?.name}</strong>'s turn to pick!
            </p>
        </div>
      )}

      {/* Debug view: keep this while building so you can see state changes */}
      <pre style={{ background: '#1b1b1b', padding: 12, borderRadius: 8 }}>
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );
}

export default DraftPage;
