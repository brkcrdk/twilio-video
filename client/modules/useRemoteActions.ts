import { useEffect, useState } from 'react';
import { Participant, LocalDataTrack, Track } from 'twilio-video';
import { useRoom } from 'store';

interface RemoteActionProps {
  onMute: () => void;
  onKick: () => void;
}

enum ActionTypes {
  KICK_USER = 'KICK_USER',
  MUTE_USER = 'MUTE_USER',
}

/**
 * Bu hook, remote(karşı) tarafın sesini kapatmak ve onu toplantıdan atmak gibi
 * aksiyonları yönettiğimiz ve oluşturduğumuz hooktor.
 *
 * Şu anda bu hook remote kullanıcıyı odadan atmak ve mikrofonunu kapatmaya yarar
 * Bu eventler tetiklendiği zaman alınması gereken aksiyonlar da onMute ve onKicktir
 * Bu eventler useEffect içinde çalışır
 */
const useRemoteActions = ({ onMute, onKick }: RemoteActionProps) => {
  const {
    state: { room },
  } = useRoom();

  const [dataTrack, setDataTrack] = useState<LocalDataTrack | null>();

  useEffect(() => {
    const localDataTrack = new LocalDataTrack();

    room?.localParticipant.publishTrack(localDataTrack);
    setDataTrack(localDataTrack);
  }, [room]);

  useEffect(() => {
    const handleTrackSubscribed = (participant: Participant) => {
      /**
       * Karşı taraftan gelen mesaj burada dinlenilir. Karşı taraftan gelen
       * mesaja göre buradaki local kullanıcı aksiyon alır.
       */
      participant.on('trackSubscribed', (track: Track) => {
        if (track.kind === 'data') {
          track.on('message', (message: string) => {
            const { type }: { type: ActionTypes } = JSON.parse(message);

            switch (type) {
              case ActionTypes.KICK_USER: {
                return onKick();
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
        type: ActionTypes.KICK_USER,
      })
    );
  };

  return { handleKickRemoteParticipant };
};

export default useRemoteActions;
