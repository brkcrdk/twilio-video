import { useRoom } from 'store';

function Disconnected() {
  const { dispatch } = useRoom();
  return (
    <div>
      Toplantıdan ayrıldınız
      <button onClick={() => dispatch({ type: 'CLEAR_ROOM' })}>
        Yeniden katıl
      </button>
    </div>
  );
}
export default Disconnected;
