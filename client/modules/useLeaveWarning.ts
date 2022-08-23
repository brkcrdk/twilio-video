import { useEffect } from 'react';

const useLeaveWarning = (leavingEvent: () => void) => {
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
    window.addEventListener('beforeunload', leavingEvent);
    return () => {
      window.removeEventListener('beforeunload', leavingEvent);
    };
  }, [leavingEvent]);
};

export default useLeaveWarning;
