import { useEffect, useState } from 'react';
import { useRoom } from 'store';
import { createLocalAudioTrack, Participant } from 'twilio-video';

const useAudioControllers = () => {
  const {
    state: { room },
  } = useRoom();
  const [isLocalAudioOn, setIsLocalAudioOn] = useState(false);
  const [isRemoteAudioOn, setIsRemoteAudioOn] = useState(false);

  useEffect(() => {
    if (room?.localParticipant) {
      const { localParticipant } = room;
      localParticipant.audioTracks.forEach(track => {
        setIsLocalAudioOn(track.isTrackEnabled);
      });
    }
  }, [room]);

  useEffect(() => {
    /**
     * `participantConnected` ile yeni katılan kişilerin eventlerini dinlemeye başlıyoruz
     * `room?.participants` ile daha önceden katılmış olan kişilerin eventlerini dinlemeye başlıyoruz
     *  bu nedenle iki grup tarafı için ayrı event tanımlamaları yapmak gerekiyor.
     */
    const handleRemoteAudio = (participant: Participant) => {
      participant.on('trackPublished', track => {
        if (track.kind === 'audio') {
          setIsRemoteAudioOn(true);
        }
      });
      participant.on('trackUnpublished', track => {
        if (track.kind === 'audio') {
          setIsRemoteAudioOn(false);
        }
      });
    };
    room?.on('participantConnected', handleRemoteAudio);
    room?.participants.forEach(handleRemoteAudio);
  }, [room]);

  const toggleAudio = async () => {
    if (isLocalAudioOn) {
      room?.localParticipant.audioTracks.forEach(publication => {
        publication.unpublish();
        publication.track.disable();
        publication.track.stop();
        setIsLocalAudioOn(false);
      });
    } else {
      const localTrack = await createLocalAudioTrack();
      room?.localParticipant.publishTrack(localTrack);
      room?.localParticipant.audioTracks.forEach(publication => {
        publication.track.enable();
      });
      setIsLocalAudioOn(true);
    }
  };

  return { toggleAudio, isLocalAudioOn, isRemoteAudioOn };
};

export default useAudioControllers;
