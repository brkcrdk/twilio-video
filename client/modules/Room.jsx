import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useRoom } from 'store';
import useLeavingRoom from './useLeavingRoom';

function Room() {
  const {
    state: { room },
  } = useRoom();

  const { push } = useRouter();
  const localRef = useRef(null);
  const remoteRef = useRef(null);

  useLeavingRoom(() => setParticipants(null));

  const [participants, setParticipants] = useState(null);

  useEffect(() => {
    if (room?.localParticipant) {
      const { localParticipant } = room;

      localParticipant.videoTracks.forEach(val => {
        if (localRef?.current) {
          val.track.attach(localRef?.current);
        }
      });
    }
  }, [room]);

  useEffect(() => {
    if (room) {
      room.on('participantConnected', participant => {
        setParticipants(participant);
        participant.on('trackSubscribed', track => {
          if (remoteRef?.current) {
            track.attach(remoteRef.current);
          }
        });
      });
    }
  }, [room]);

  useEffect(() => {
    if (room) {
      room.participants.forEach(participant => {
        setParticipants(participant);
        participant.on('trackSubscribed', track => {
          if (remoteRef?.current) {
            track.attach(remoteRef.current);
          }
        });
      });
    }
  }, [room]);

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
    </div>
  );
}
export default Room;
