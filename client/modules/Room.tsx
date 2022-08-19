import { useRouter } from 'next/router';

function Room() {
  const {
    query: { roomName },
  } = useRouter();
  return <div>join this room {roomName}</div>;
}
export default Room;
