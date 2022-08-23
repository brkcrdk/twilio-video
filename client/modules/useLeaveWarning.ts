import { useEffect } from 'react';

const useLeaveWarning = (leavingEvent: () => void) => {
  useEffect(() => {
    window.addEventListener('beforeunload', leavingEvent);
    return () => {
      window.removeEventListener('beforeunload', leavingEvent);
    };
  }, [leavingEvent]);
};

export default useLeaveWarning;
