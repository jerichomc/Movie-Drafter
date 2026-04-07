import { useReducer } from 'react';
import { draftReducer, initialDraftState } from './state/draftReducer';
import SetupPanel from './components/SetupPanel';
import DraftBoard from './components/DraftBoard';
import MovieSearch from './components/MovieSearch';

import podcastLogo from '../../assets/Podcast Cover Photo.PNG';

function DraftPage() {
  const [state, dispatch] = useReducer(draftReducer, initialDraftState);

  const currentPick = state.pickSlots[state.currentPickIndex];
  const currentPlayer = state.players.find((p) => p.id === currentPick?.playerId);

  return (
    <div style={{ padding: 16 }}>
      {state.status === 'setup' && <SetupPanel state={state} dispatch={dispatch} />}

      {state.status === 'drafting' && (
        <>
          <div
            style={{
              marginBottom: 12,
              marginLeft: 'auto',
              marginRight: 'auto',
              maxWidth: 480,
            }}
          >
            <h2>Drafting</h2>

            <p style={{ opacity: 0.85 }}>
              Pick {state.currentPickIndex + 1} of {state.pickSlots.length}
            </p>

            <p>
              Round {currentPick.round} - <strong>{currentPlayer?.name}</strong> is picking
            </p>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
              <button
                onClick={() => dispatch({ type: 'UNDO_PICK' })}
                disabled={!state.pickSlots.some((s) => s.item)}
              >
                Undo Last Pick
              </button>
            </div>

            <MovieSearch
              disabled={Boolean(currentPick?.item)}
              draftTarget={state.meta.draftTarget}
              personRoleFilter={state.meta.personRoleFilter}
              onSelect={(item) =>
                dispatch({
                  type: 'MAKE_PICK',
                  payload: { item },
                })
              }
            />
          </div>

          <div id="export-area" style={{ padding: 16, borderRadius: 14, background: '#0b0b0b' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: 12,
                gap: 8,
              }}
            >
              <img
                src={podcastLogo}
                alt="Podcast logo"
                style={{ height: 170, width: 'auto', display: 'block', borderRadius: 100 }}
              />

              <div style={{ fontSize: 22, fontWeight: 700 }}>
                {state.meta.category?.trim()
                  ? state.meta.category
                  : state.meta.draftTarget === 'person'
                    ? 'Person Draft'
                    : 'Movie Draft'}
              </div>
            </div>

            <DraftBoard state={state} />
          </div>
        </>
      )}

      {state.status === 'finished' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12, gap: 10 }}>
            <button onClick={() => dispatch({ type: 'UNDO_PICK' })}>
              Undo Last Pick
            </button>
          </div>

          <div id="export-area" style={{ padding: 16, borderRadius: 14, background: '#0b0b0b' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: 12,
                gap: 8,
              }}
            >
              <img
                src={podcastLogo}
                alt="Podcast logo"
                style={{ height: 80, width: 'auto', display: 'block' }}
              />

              <div style={{ fontSize: 22, fontWeight: 700 }}>
                {state.meta.category?.trim()
                  ? state.meta.category
                  : state.meta.draftTarget === 'person'
                    ? 'Person Draft'
                    : 'Movie Draft'}
              </div>
            </div>

            <DraftBoard state={state} />
          </div>
        </>
      )}
    </div>
  );
}

export default DraftPage;
