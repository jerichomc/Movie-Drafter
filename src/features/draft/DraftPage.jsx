import { useReducer } from 'react';
import { draftReducer, initialDraftState } from './state/draftReducer';
import SetupPanel from './components/SetupPanel';
import DraftBoard from './components/DraftBoard';
import MovieSearch from './components/MovieSearch';

// NEW: podcast logo import (make sure the file exists at this path)
import podcastLogo from '../../assets/Podcast Cover Photo.PNG'

function DraftPage() {
  const [state, dispatch] = useReducer(draftReducer, initialDraftState);

  const currentPick = state.pickSlots[state.currentPickIndex];
  const currentPlayer = state.players.find((p) => p.id === currentPick?.playerId);

  return (
    <div style={{ padding: 16, marginLeft: 160 }}>
      {/* <h1>Movie Draft</h1> */}

      {state.status === 'setup' && (
        <SetupPanel state={state} dispatch={dispatch} />
      )}

      {state.status === 'drafting' && (
        <>
          
          <div style={{ marginBottom: 12 }}>
            {/* <h2>Drafting</h2> */}
            <p style={{opacity: 0.85}}>
              Pick {state.currentPickIndex + 1} of {state.pickSlots.length} 
            </p>

            <p>
              Round {currentPick.round} — <strong>{currentPlayer?.name}</strong> is picking
            </p>

            <div style={{display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10}}>
              <button onClick={() => dispatch({type: 'UNDO_PICK'})}
                disabled={!state.pickSlots.some((s) => s.movie)}>
                Undo Last Pick
              </button>
            </div>

            <MovieSearch
              disabled={Boolean(currentPick?.movie) || state.status !== 'drafting'}
              onSelect={(movie) =>
                dispatch({
                  type: 'MAKE_PICK',
                  payload: { movie },
                })
              }
            />
          </div>

          {/* NEW: centered logo + category above the board */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: 18,
              marginBottom: 12,
              gap: 8,
            }}
          >
            <img
              src={podcastLogo}
              alt="Podcast logo"
              style={{
                height: 160,
                width: 'auto',
                display: 'block',
                borderRadius: 100,
              }}
            />

            <div style={{ fontSize: 22, fontWeight: 700 }}>
              {state.meta.category?.trim() ? state.meta.category : 'Movie Draft'}
            </div>
          </div>

          <DraftBoard state={state} />
        </>
      )}

      {state.status === 'finished' && (
        <>
          {/* NEW: show same header block when finished */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: 18,
              marginBottom: 12,
              gap: 8,
            }}
          >
            <img
              src={podcastLogo}
              alt="Podcast logo"
              style={{ height: 160, width: 'auto', display: 'block', borderRadius: 100 }}
            />
            <div style={{ fontSize: 22, fontWeight: 700 }}>
              {state.meta.category?.trim() ? state.meta.category : 'Movie Draft'}
            </div>
          </div>

          <DraftBoard state={state} />
        </>
      )}

      {/* <pre style={{ background: '#1b1b1b', padding: 12 }}>
        {JSON.stringify(state, null, 2)}
      </pre> */}
    </div>
  );
}

export default DraftPage;

