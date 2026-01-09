import { generatePickSlots } from '../utils/snake';

export const initialDraftState = {
  status: 'setup',
  players: [],
  settings: { rounds: 3, draftType: 'snake' },
  draftOrder: [],
  pickSlots: [],
  currentPickIndex: 0,
};

export function draftReducer(state, action) {
  switch (action.type) {
    case 'ADD_PLAYER': {
      const name =
        action.payload?.name?.trim() ||
        `Player ${state.players.length + 1}`;

      return {
        ...state,
        players: [
          ...state.players,
          { id: crypto.randomUUID(), name },
        ],
      };
    }

    case 'REMOVE_PLAYER': {
      return {
        ...state,
        players: state.players.filter(
          (p) => p.id !== action.payload.playerId
        ),
      };
    }

    case 'RENAME_PLAYER': {
      return {
        ...state,
        players: state.players.map((p) =>
          p.id === action.payload.playerId
            ? { ...p, name: action.payload.name }
            : p
        ),
      };
    }

    case 'SET_ROUNDS': {
      return {
        ...state,
        settings: {
          ...state.settings,
          rounds: Math.max(1, Number(action.payload.rounds)),
        },
      };
    }

    case 'RANDOMIZE_DRAFT_ORDER': {
      const shuffled = [...state.players]
        .map((p) => ({ ...p, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map((p) => p.id);

      return {
        ...state,
        draftOrder: shuffled,
      };
    }

    case 'START_DRAFT': {
      if (state.players.length < 2) return state;

      const order =
        state.draftOrder.length > 0
          ? state.draftOrder
          : state.players.map((p) => p.id);

      const pickSlots = generatePickSlots(
        order,
        state.settings.rounds
      );

      return {
        ...state,
        status: 'drafting',
        draftOrder: order,
        pickSlots,
        currentPickIndex: 0,
      };
    }

    case 'RESET_DRAFT': {
      return initialDraftState;
    }

    default:
      return state;
  }
}
