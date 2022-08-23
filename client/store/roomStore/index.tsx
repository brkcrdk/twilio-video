import { createContext, ReactNode, useReducer, FC, Dispatch } from 'react';
import { Room } from 'twilio-video';

type roomType = Room | null;

interface StateProps {
  room: roomType;
  disconnected?: boolean;
}
interface RoomAction {
  type: 'SET_ROOM' | 'CLEAR_ROOM' | 'DISCONNECT';
  payload?: StateProps;
}

interface IRoomContext {
  state: StateProps;
  dispatch: Dispatch<RoomAction>;
}

const initialState = {
  room: null,
  disconnected: false,
};

const RoomContext = createContext<IRoomContext>({
  state: initialState,
  dispatch: () => ({}),
});

interface IRoomProvider {
  children?: ReactNode;
}

function reducer(state: StateProps, action: RoomAction) {
  const { payload } = action;
  switch (action.type) {
    case 'SET_ROOM': {
      if (payload?.room) {
        return { ...state, room: payload?.room };
      } else {
        return state;
      }
    }

    case 'DISCONNECT': {
      return { ...initialState, disconnected: true };
    }
    case 'CLEAR_ROOM': {
      return initialState;
    }
    default: {
      return state;
    }
  }
}
const RoomProvider: FC<IRoomProvider> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <RoomContext.Provider value={{ state, dispatch }}>
      {children}
    </RoomContext.Provider>
  );
};

export { RoomContext, RoomProvider };
