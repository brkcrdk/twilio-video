import { useRef } from 'react';

import { useRoom } from 'store';
import useLeavingRoom from './useLeavingRoom';
import Video from './Video';
import styles from 'styles/Home.module.css';
import useVideoControllers from './useVideoContollers';

function Room() {
  const {
    state: { room },
    dispatch,
  } = useRoom();

  const localRef = useRef(null);
  const remoteRef = useRef(null);

  const {
    toggleCam,
    clearRemoteUser,
    remoteUser,
    displayVideo,
    isCamOpening,
    remoteVideo,
  } = useVideoControllers({
    localRef,
    remoteRef,
  });

  useLeavingRoom(clearRemoteUser);

  return (
    <div className={styles.roomContainer}>
      <div className={styles.videosContainer}>
        {room?.localParticipant && (
          <Video
            ref={localRef}
            participant={room?.localParticipant}
            hasVideo={displayVideo}
            isLoading={isCamOpening}
            isRemote
          />
        )}
        {remoteUser && (
          <Video
            ref={remoteRef}
            participant={remoteUser}
            hasVideo={remoteVideo}
          />
        )}
      </div>
      <button
        onClick={() => {
          // disconnect olunduğu zaman kamera da stop edilmeli
          // ilk kamera durdurulup ondan sonra disconnect edilmeli, belki??
          room?.disconnect();
          dispatch({
            type: 'DISCONNECT',
          });
        }}
      >
        Ayrıl
      </button>
      <button onClick={toggleCam}>
        Kamera Aç/Kapa {JSON.stringify(displayVideo)}
      </button>
    </div>
  );
}

export default Room;
