import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { Participant, createLocalVideoTrack } from 'twilio-video';

import { useRoom } from 'store';
import useLeavingRoom from './useLeavingRoom';
import Video from './Video';
function Room() {
  const {
    state: { room },
  } = useRoom();

  const { push } = useRouter();
  const localRef = useRef(null);
  const remoteRef = useRef(null);

  const [displayVideo, setDisplayVideo] = useState(false);
  const [remoteUser, setRemoteUser] = useState<Participant | null>(null);

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

  const toggleCam = async () => {
    if (displayVideo) {
      room?.localParticipant.videoTracks.forEach(publication => {
        publication.unpublish();
        publication.track.disable();
        publication.track.stop();
        setDisplayVideo(false);
      });
    } else {
      const localTrack = await createLocalVideoTrack();
      room?.localParticipant.publishTrack(localTrack);
      room?.localParticipant.videoTracks.forEach(publication => {
        publication.track.enable();
      });
      if (localRef.current) {
        localTrack.attach(localRef.current);
      }
      setDisplayVideo(true);
    }
  };

  return (
    <div id="video-container">
      {room?.localParticipant && (
        <Video ref={localRef} participant={room?.localParticipant} />
      )}
      {remoteUser && <Video ref={remoteRef} participant={remoteUser} />}

      <button
        onClick={() => {
          room?.disconnect();
          push('/');
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
