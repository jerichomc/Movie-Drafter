// This is the "single source of truth" for draft data.
// React will store this state object and only change it via the reducer.

export const initialDraftState = {
  status: 'setup', // can later become: 'drafting' or 'finished'
  players: [],
  settings: { rounds: 3, draftType: 'snake' },
  draftOrder: [],
  pickSlots: [],
  currentPickIndex: 0,
};

// Reducer = a function that receives (currentState, action)
// and returns the NEXT state.
export function draftReducer(state, action) {
  switch (action.type) {
    case 'ADD_PLAYER': {
      const name =
        action.payload?.name ??
        `Player ${state.players.length + 1}`;

      const newPlayer = {
        id: crypto.randomUUID(), // simple unique id for React lists + logic
        name,
      };

      return {
        ...state,
        players: [...state.players, newPlayer],
      };
    }

    case 'SET_ROUNDS': {
      const nextRounds = Number(action.payload?.rounds ?? state.settings.rounds);

      // Clamp to minimum 1 round
      const safeRounds = Number.isFinite(nextRounds) ? Math.max(1, nextRounds) : state.settings.rounds;

      return {
        ...state,
        settings: {
          ...state.settings,
          rounds: safeRounds,
        },
      };
    }

    case 'RESET_DRAFT': {
      return initialDraftState;
    }

    // Not implemented yet (we'll do these in later steps)
    case 'REMOVE_PLAYER':
    case 'RENAME_PLAYER':
    case 'RANDOMIZE_DRAFT_ORDER':
    case 'START_DRAFT':
    case 'MAKE_PICK':
    case 'UNDO_PICK':
    default:
      return state;
  }
}
