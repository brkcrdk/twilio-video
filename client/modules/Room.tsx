import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { Participant, createLocalVideoTrack } from 'twilio-video';

import { useRoom } from 'store';
import useLeavingRoom from './useLeavingRoom';

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

  useEffect(() => {
    // function handleTrackEnabled(track: RemoteTrackPublication) {
    //   track.on('enabled', () => {
    //     /* Hide the avatar image and show the associated <video> element. */
    //   });
    // }
    // room?.participants.forEach(participant => {
    //   participant.tracks.forEach(publication => {
    //     if (publication.isSubscribed && publication.kind !== 'data' &&) {
    //       handleTrackEnabled(publication.track);
    //     }
    //     publication.on('subscribed', handleTrackEnabled);
    //   });
    // });
  }, []);

  const toggleCam = async () => {
    if (displayVideo) {
      room?.localParticipant.videoTracks.forEach(publication => {
        setDisplayVideo(false);
        publication.unpublish();
        publication.track.disable();
        publication.track.stop();
      });
    } else {
      const localTrack = await createLocalVideoTrack();
      setDisplayVideo(true);
      room?.localParticipant.publishTrack(localTrack);
      room?.localParticipant.videoTracks.forEach(publication => {
        publication.track.enable();
      });
      if (localRef.current) {
        localTrack.attach(localRef.current);
      }
    }

    // createLocalVideoTrack().then(track => {
    //   const localMediaContainer = document.getElementById('local-media-div');
    //   localMediaContainer.appendChild(track.attach());
    //   return localParticipant.publishTrack(track);
    // });

    // if (displayVideo) {
    //   room?.localParticipant.videoTracks.forEach(publication => {
    //     setDisplayVideo(false);
    //     publication.track.disable();
    //   });
    // } else {
    //   room?.localParticipant.videoTracks.forEach(publication => {
    //     setDisplayVideo(true);
    //     publication.track.enable();
    //   });
    // }
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
