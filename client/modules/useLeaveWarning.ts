import { useEffect } from 'react';

const useLeaveWarning = (leavingEvent: () => void) => {
  // useEffect(() => {
  //   window.addEventListener('beforeunload', leavingEvent);
  //   return () => {
  //     window.removeEventListener('beforeunload', leavingEvent);
  //   };
  // }, [leavingEvent]);

  useEffect(() => {
    window?.history.pushState(null, '', '');
    window?.addEventListener('popstate', function () {
      window?.history.pushState(null, '', '');
    });
  }, []);
};

export default useLeaveWarning;
