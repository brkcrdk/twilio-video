import { MutableRefObject, useEffect, useState } from 'react';
import { createLocalVideoTrack, Participant } from 'twilio-video';

import { useRoom } from 'store';
import { videoContraints } from 'videoConstants';

interface Props {
  localRef: MutableRefObject<null>;
  remoteRef: MutableRefObject<null>;
}

const useVideoControllers = ({ localRef, remoteRef }: Props) => {
  const {
    state: { room },
  } = useRoom();

  const [displayVideo, setDisplayVideo] = useState(false);
  const [remoteVideo, setRemoteVideo] = useState(false);
  const [remoteUser, setRemoteUser] = useState<Participant | null>(null);
  const [isCamOpening, setIsCamOpening] = useState(false);

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
  }, [room, localRef]);

  useEffect(() => {
    room?.participants.forEach(participant => {
      participant.videoTracks.forEach(publication => {
        publication.on('unsubscribed', () => setRemoteVideo(false));
        publication.on('subscribed', () => setRemoteVideo(true));
      });
    });
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
  }, [room, remoteRef]);

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

  const clearRemoteUser = () => setRemoteUser(null);

  return {
    toggleCam,
    clearRemoteUser,
    remoteUser,
    displayVideo,
    isCamOpening,
    remoteVideo,
  };
};

export default useVideoControllers;
