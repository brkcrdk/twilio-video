import { useContext } from 'react';
import { RoomContext } from './index';

const useRoom = () => {
  const { state, dispatch } = useContext(RoomContext);

  return { state, dispatch };
};

export default useRoom;
