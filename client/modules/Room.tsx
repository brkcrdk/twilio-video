import { useRef } from 'react';

import styles from 'styles/Home.module.css';
import { useRoom } from 'store';
import useLeavingRoom from './useLeavingRoom';
import Video from './Video';
import useVideoControllers from './useVideoContollers';
import useAudioControllers from './useAudioControllers';
import VideoDevices from './VideoDevices';
import AudioDevices from './AudioDevices';
import useRemoteActions from './useRemoteActions';

function Room() {
  const {
    state: { room },
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

  const { handleDisconnect } = useLeavingRoom(clearRemoteUser);

  const { handleKickRemoteParticipant } = useRemoteActions({
    onKick: () => console.log('onkick'),
    onMute: () => console.log('onMute'),
  });

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
            onKickRemoteParticipant={handleKickRemoteParticipant}
          />
        )}
      </div>
      <button onClick={handleDisconnect}>Ayrıl</button>
      <button onClick={toggleCam}>Kamera Aç/Kapa</button>
      <button onClick={toggleAudio}>Mikrofon Aç/Kapa</button>
      <VideoDevices />
      <AudioDevices />
    </div>
  );
}

export default Room;
