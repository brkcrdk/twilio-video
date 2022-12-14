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

  const [isLocalVideoOn, setIsLocalVideoOn] = useState(false);
  const [isRemoteVideOn, setIsRemoteVideoOn] = useState(false);
  const [remoteUser, setRemoteUser] = useState<Participant | null>(null);
  const [isCamOpening, setIsCamOpening] = useState(false);

  useEffect(() => {
    if (room?.localParticipant) {
      const { localParticipant } = room;
      localParticipant.videoTracks.forEach(track => {
        setIsLocalVideoOn(track.isTrackEnabled);
        if (localRef?.current) {
          track.track.attach(localRef?.current);
        }
      });
    }
  }, [room, localRef]);

  useEffect(() => {
    /**
     * `participantConnected` ile yeni katılan kişilerin eventlerini dinlemeye başlıyoruz
     * `room?.participants` ile daha önceden katılmış olan kişilerin eventlerini dinlemeye başlıyoruz
     *  bu nedenle iki grup tarafı için ayrı event tanımlamaları yapmak gerekiyor.
     */
    const handleRemoteVideo = (participant: Participant) => {
      participant.on('trackPublished', track => {
        if (track.kind === 'video') {
          setIsRemoteVideoOn(true);
        }
      });
      participant.on('trackUnpublished', track => {
        if (track.kind === 'video') {
          setIsRemoteVideoOn(false);
        }
      });
    };
    room?.on('participantConnected', handleRemoteVideo);
    room?.participants.forEach(handleRemoteVideo);
  }, [room]);

  useEffect(() => {
    const handleTrackSubscribed = (participant: Participant) => {
      setRemoteUser(participant);

      participant.on('trackSubscribed', track => {
        // Bu şekilde gelen trackin tipi data değilse
        // hem sesi hem de videoyu aynı elementin içine yerleştiriyoruz
        // böylece hem ses hem video için ayrı elementler eklememiz gerekmiyor
        if (remoteRef?.current && track.kind !== 'data') {
          track.attach(remoteRef.current);
        }
        // Track.kind audio da olabileceği için bu event ses için çalıştığında
        // video statenini güncellemememeli. Bunu da bu şekilde yönetebiliyoruz.
        if (track.kind === 'video') {
          setIsRemoteVideoOn(track.isEnabled);
        }
      });
    };

    if (room) {
      room.on('participantConnected', handleTrackSubscribed);
      room.participants.forEach(handleTrackSubscribed);
    }
  }, [room, remoteRef]);

  const toggleCam = async () => {
    if (isLocalVideoOn) {
      room?.localParticipant.videoTracks.forEach(publication => {
        publication.unpublish();
        publication.track.disable();
        publication.track.stop();
        setIsLocalVideoOn(false);
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
      setIsLocalVideoOn(true);
      setIsCamOpening(false);
    }
  };

  const clearRemoteUser = () => setRemoteUser(null);

  return {
    toggleCam,
    clearRemoteUser,
    remoteUser,
    isLocalVideoOn,
    isCamOpening,
    isRemoteVideOn,
  };
};

export default useVideoControllers;
