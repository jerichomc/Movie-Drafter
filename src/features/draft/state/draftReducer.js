import { generatePickSlots } from '../utils/snake';

export const initialDraftState = {
  status: 'setup',
  players: [],
  settings: { rounds: 3, draftType: 'snake' },

  // NEW: metadata about the draft (category/theme)
  meta: {
    category: '',
  },

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
        players: [...state.players, { id: crypto.randomUUID(), name }],
      };
    }

    case 'REMOVE_PLAYER': {
      return {
        ...state,
        players: state.players.filter((p) => p.id !== action.payload.playerId),
      };
    }

    case 'RENAME_PLAYER': {
      return {
        ...state,
        players: state.players.map((p) =>
          p.id === action.payload.playerId ? { ...p, name: action.payload.name } : p
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

    // NEW: set the draft category
    case 'SET_CATEGORY': {
      const category = action.payload?.category ?? '';
      return {
        ...state,
        meta: {
          ...state.meta,
          category,
        },
      };
    }

    case 'RANDOMIZE_DRAFT_ORDER': {
      const shuffled = [...state.players]
        .map((p) => ({ ...p, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map((p) => p.id);

      return { ...state, draftOrder: shuffled };
    }

    case 'START_DRAFT': {
      if (state.players.length < 2) return state;

      const order =
        state.draftOrder.length > 0
          ? state.draftOrder
          : state.players.map((p) => p.id);

      const pickSlots = generatePickSlots(order, state.settings.rounds);

      return {
        ...state,
        status: 'drafting',
        draftOrder: order,
        pickSlots,
        currentPickIndex: 0,
      };
    }

    case 'MAKE_PICK': {
      const movie = action.payload?.movie;
      if (!movie) return state;

      const pickIndex = state.currentPickIndex;
      const currentSlot = state.pickSlots[pickIndex];
      if (!currentSlot) return state;

      const alreadyPicked = state.pickSlots.some(
        (slot) => slot.movie?.tmdbId === movie.tmdbId
      );
      if (alreadyPicked) return state;

      const nextPickSlots = state.pickSlots.map((slot) =>
        slot.pickIndex === pickIndex ? { ...slot, movie } : slot
      );

      const nextIndex = pickIndex + 1;
      const isFinished = nextIndex >= nextPickSlots.length;

      return {
        ...state,
        pickSlots: nextPickSlots,
        currentPickIndex: isFinished ? pickIndex : nextIndex,
        status: isFinished ? 'finished' : state.status,
      };
    }

    case 'RESET_DRAFT': {
      return initialDraftState;
    }
    
    //undo most recent pick, unless at pick 0
    case 'UNDO_PICK': {
      const hasAnyPicked = state.pickSlots.some((s) => s.movie != null);
      if (!hasAnyPicked) return state;

      //figure out which pick to undo
      const undoIndex = 
        state.status === 'finished'
        ? state.pickSlots.length - 1
        : Math.max(0, state.currentPickIndex - 1);

        //if slot is already empty, move back to find last picked slot
        let idx = undoIndex;
        while (idx >= 0 && !state.pickSlots[idx].movie) {
          idx -= 1;
        }
        if (idx < 0) return state; //no picks to undo

        const nextPickSlots = state.pickSlots.map((slot) => 
          slot.pickIndex === idx ? {...slot, movie: null} : slot
        );
        return {
          ...state,
          pickSlots: nextPickSlots,
          currentPickIndex: idx,
          status: 'drafting',
        }
    }

    default:
      return state;
  }
}
