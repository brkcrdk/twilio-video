import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useRoom } from 'store';
import useLeavingRoom from './useLeavingRoom';
import { Participant } from 'twilio-video';

function Room() {
  const {
    state: { room },
  } = useRoom();

  const { push } = useRouter();
  const localRef = useRef(null);
  const remoteRef = useRef(null);

  const [displayVideo, setDisplayVideo] = useState(false);

  useLeavingRoom(() => setParticipants(null));

  const [participants, setParticipants] = useState<Participant | null>(null);

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
      setParticipants(participant);
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
        setDisplayVideo(false);
        publication.track.disable();
      });
    } else {
      room?.localParticipant.videoTracks.forEach(publication => {
        setDisplayVideo(true);
        publication.track.enable();
      });
    }
  };

  return (
    <div id="video-container">
      {room?.localParticipant && (
        <>
          <video ref={localRef} autoPlay playsInline />
          <span>{room?.localParticipant.identity}</span>
        </>
      )}
      {participants && (
        <>
          <video ref={remoteRef} autoPlay playsInline />
          <span>{participants?.identity}</span>
        </>
      )}
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
