import { useEffect } from 'react';
import { useRoom } from 'store';

const useLeavingRoom = (leavingEvent: () => void) => {
  const {
    state: { room },
    dispatch,
  } = useRoom();

  const handleDisconnect = () => {
    // disconnect olunduğu zaman kamera da stop edilmeli
    // ilk kamera durdurulup ondan sonra disconnect edilmeli, belki??
    // Canlıda test ettikten sonra bu durumu tekrar test edeceğim gerekliliğini o zaman daha iyi
    // anlayabilirim

    // room?.localParticipant.videoTracks.forEach(publication => {
    //   publication.unpublish();
    //   publication.track.stop();
    // });

    room?.disconnect();
    return dispatch({
      type: 'DISCONNECT',
    });
  };

  useEffect(() => {
    if (room) {
      room.on('participantDisconnected', () => {
        leavingEvent();
      });
    }
  }, [room]);

  useEffect(() => {
    if (room) {
      room.on('disconnected', room => {
        room.localParticipant.videoTracks.forEach(track => {
          const attachedElements = track.track.detach();
          attachedElements.forEach(element => element.remove());
        });
      });
    }
  }, [room]);

  // Prevent going back
  useEffect(() => {
    window?.history.pushState(null, '', '');
    window?.addEventListener('popstate', function () {
      window?.history.pushState(null, '', '');
    });
  }, []);

  // When leaving the page with refresh or closing tab.
  // Trigger leaving event
  useEffect(() => {
    window.addEventListener('beforeunload', () => room?.disconnect());
    return () => {
      window.removeEventListener('beforeunload', () => room?.disconnect());
    };
  }, [leavingEvent]);

  return { handleDisconnect };
};

export default useLeavingRoom;
