import { useReducer } from 'react';
import { draftReducer, initialDraftState } from './state/draftReducer';
import SetupPanel from './components/SetupPanel';
import DraftBoard from './components/DraftBoard';
import MovieSearch from './components/MovieSearch'; // NEW: TMDB autocomplete

function DraftPage() {
  const [state, dispatch] = useReducer(draftReducer, initialDraftState);

  const currentPick = state.pickSlots[state.currentPickIndex];
  const currentPlayer = state.players.find(
    (p) => p.id === currentPick?.playerId
  );

  const isFinished = state.status === 'finished'; // NEW: disable search when done

  return (
    <div style={{ padding: 16 }}>
      <h1>Movie Draft</h1>

      {state.status === 'setup' && (
        <SetupPanel state={state} dispatch={dispatch} />
      )}

      {state.status === 'drafting' && (
        <>
          <div style={{ marginBottom: 12 }}>
            <h2>Drafting</h2>
            <p>
              Round {currentPick.round} —{' '}
              <strong>{currentPlayer?.name}</strong> is picking
            </p>

            {/* NEW: TMDB search box */}
            <MovieSearch
              disabled={isFinished}
              onSelect={(movie) =>
                dispatch({
                  type: 'MAKE_PICK',
                  payload: { movie },
                })
              }
            />
          </div>

          <DraftBoard state={state} />
        </>
      )}

      {state.status === 'finished' && (
        <>
          <h2>Finished</h2>

          {/* NEW: allow viewing board after draft ends */}
          <MovieSearch disabled={true} onSelect={() => {}} />
          <DraftBoard state={state} />
        </>
      )}

      <pre style={{ background: '#1b1b1b', padding: 12 }}>
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );
}

export default DraftPage;

