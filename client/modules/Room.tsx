import { useRef } from 'react';

import styles from 'styles/Home.module.css';
import { useRoom } from 'store';
import useLeavingRoom from './useLeavingRoom';
import Video from './Video';
import useVideoControllers from './useVideoContollers';
import useAudioControllers from './useAudioControllers';
import VideoDevices from './VideoDevices';
import AudioDevices from './AudioDevices';
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
    isLocalVideoOn,
    isCamOpening,
    isRemoteVideOn,
  } = useVideoControllers({
    localRef,
    remoteRef,
  });

  const { toggleAudio, isLocalAudioOn, isRemoteAudioOn } =
    useAudioControllers();

  useLeavingRoom(clearRemoteUser);

  return (
    <div className={styles.roomContainer}>
      <div className={styles.videosContainer}>
        {room?.localParticipant && (
          <Video
            ref={localRef}
            participant={room?.localParticipant}
            hasVideo={isLocalVideoOn}
            hasAudio={isLocalAudioOn}
            isLoading={isCamOpening}
            isLocal
          />
        )}
        {remoteUser && (
          <Video
            ref={remoteRef}
            participant={remoteUser}
            hasVideo={isRemoteVideOn}
            hasAudio={isRemoteAudioOn}
          />
        )}
      </div>
      <button
        onClick={() => {
          // disconnect olunduğu zaman kamera da stop edilmeli
          // ilk kamera durdurulup ondan sonra disconnect edilmeli, belki??
          // Canlıda test ettikten sonra bu durumu tekrar test edeceğim gerekliliğini o zaman daha iyi
          // anlayabilirim

          // room?.localParticipant.videoTracks.forEach(publication => {
          //   publication.unpublish();
          //   publication.track.stop();
          // });

          room?.disconnect();
          dispatch({
            type: 'DISCONNECT',
          });
        }}
      >
        Ayrıl
      </button>
      <button onClick={toggleCam}>Kamera Aç/Kapa</button>
      <button onClick={toggleAudio}>Mikrofon Aç/Kapa</button>
      <VideoDevices />
      <AudioDevices />
    </div>
  );
}

export default Room;
