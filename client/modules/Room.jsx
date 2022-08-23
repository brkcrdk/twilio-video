import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { connect, Participant } from 'twilio-video';
import { useRoom } from 'store';
import useLeaveWarning from './useLeaveWarning';

function Room() {
  const {
    state: { room },
  } = useRoom();

  const { push } = useRouter();

  const localRef = useRef(null);
  const remoteRef = useRef(null);

  useLeaveWarning(() => room?.disconnect());

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

  useEffect(() => {
    if (room) {
      room.on('participantDisconnected', participant => {
        setParticipants(null);
      });
    }
  }, [room]);

  useEffect(() => {
    if (room) {
      room.on('disconnected', room => {
        room.localParticipant.tracks.forEach(publication => {
          const attachedElements = publication.track.detach();
          attachedElements.forEach(element => element.remove());
        });
      });
    }
  }, [room]);

  return (
    <div id="video-container">
      {room?.localParticipant && (
        <>
          <video ref={localRef} autoPlay muted playsInline />
          <span>{room?.localParticipant.identity}</span>
        </>
      )}
      {participants && (
        <>
          <video ref={remoteRef} autoPlay muted playsInline />
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
