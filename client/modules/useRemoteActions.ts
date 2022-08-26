import { useEffect, useState } from 'react';
import { Participant, LocalDataTrack, Track } from 'twilio-video';
import { useRoom } from 'store';

/**
 * Bu hook, remote(karşı) tarafın sesini kapatmak ve onu toplantıdan atmak gibi
 * aksiyonları yönettiğimiz ve oluşturduğumuz hooktor.
 */
const useRemoteActions = () => {
  const {
    state: { room },
    dispatch,
  } = useRoom();

  const [dataTrack, setDataTrack] = useState<LocalDataTrack | null>();

  useEffect(() => {
    const localDataTrack = new LocalDataTrack();

    room?.localParticipant.publishTrack(localDataTrack);
    setDataTrack(localDataTrack);
  }, [room]);

  useEffect(() => {
    const handleTrackSubscribed = (participant: Participant) => {
      participant.on('trackSubscribed', (track: Track) => {
        if (track.kind === 'data') {
          track.on('message', (message: string) => {
            const receivedMessage = JSON.parse(message);

            switch (receivedMessage.type) {
              case 'KICK_USER': {
                room?.disconnect();
                return dispatch({
                  type: 'DISCONNECT',
                });
              }
            }
          });
        }
      });
    };

    if (room) {
      room.on('participantConnected', handleTrackSubscribed);
      room.participants.forEach(handleTrackSubscribed);
    }
  }, [room]);

  const handleKickRemoteParticipant = async () => {
    dataTrack?.send(
      JSON.stringify({
        type: 'KICK_USER',
      })
    );
  };

  return { handleKickRemoteParticipant };
};

export default useRemoteActions;
