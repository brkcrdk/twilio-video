import { useEffect, useState, useRef } from 'react';
import { Participant, createLocalVideoTrack, RemoteTrack } from 'twilio-video';

import { useRoom } from 'store';
import { videoContraints } from 'videoConstants';
import useLeavingRoom from './useLeavingRoom';
import Video from './Video';
import styles from 'styles/Home.module.css';

function Room() {
  const {
    state: { room },
    dispatch,
  } = useRoom();

  const localRef = useRef(null);
  const remoteRef = useRef(null);

  const [displayVideo, setDisplayVideo] = useState(false);
  const [remoteVideo, setRemoteVideo] = useState(false);
  const [remoteUser, setRemoteUser] = useState<Participant | null>(null);
  const [isCamOpening, setIsCamOpening] = useState(false);

  useLeavingRoom(() => setRemoteUser(null));

  useEffect(() => {
    if (room?.localParticipant) {
      const { localParticipant } = room;
      localParticipant.videoTracks.forEach(val => {
        setDisplayVideo(val.isTrackEnabled);
        if (localRef?.current) {
          val.track.attach(localRef?.current);
        }
      });
    }
  }, [room]);

  useEffect(() => {
    const handleTrackSubscribed = (participant: Participant) => {
      setRemoteUser(participant);

      participant.on('trackSubscribed', track => {
        setRemoteVideo(track.isEnabled);
        if (remoteRef?.current && track.kind !== 'data') {
          track.attach(remoteRef.current);
        }
      });
    };

    if (room) {
      room.on('participantConnected', handleTrackSubscribed);
      room.participants.forEach(handleTrackSubscribed);
    }
  }, [room]);

  useEffect(() => {
    room?.participants.forEach(participant => {
      participant.videoTracks.forEach(publication => {
        publication.on('unsubscribed', () => setRemoteVideo(false));
        publication.on('subscribed', () => setRemoteVideo(true));
      });
    });
  }, [room]);

  const toggleCam = async () => {
    if (displayVideo) {
      room?.localParticipant.videoTracks.forEach(publication => {
        publication.unpublish();
        publication.track.disable();
        publication.track.stop();
        setDisplayVideo(false);
      });
    } else {
      setIsCamOpening(true);
      const localTrack = await createLocalVideoTrack(videoContraints);
      room?.localParticipant.publishTrack(localTrack);
      room?.localParticipant.videoTracks.forEach(publication => {
        publication.track.enable();
      });
      if (localRef.current) {
        localTrack.attach(localRef.current);
      }
      setDisplayVideo(true);
      setIsCamOpening(false);
    }
  };

  return (
    <div className={styles.roomContainer}>
      <div className={styles.videosContainer}>
        {room?.localParticipant && (
          <Video
            ref={localRef}
            participant={room?.localParticipant}
            hasVideo={displayVideo}
            isLoading={isCamOpening}
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
        remote Video {JSON.stringify(remoteVideo)}
      </button>
    </div>
  );
}

export default Room;
