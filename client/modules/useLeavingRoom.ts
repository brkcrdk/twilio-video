import { useEffect } from 'react';
import { useRoom } from 'store';

const useLeavingRoom = (leavingEvent: () => void) => {
  const {
    state: { room },
  } = useRoom();

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
};

export default useLeavingRoom;
