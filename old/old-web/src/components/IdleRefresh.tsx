import { useEffect, useRef } from 'react';

const IdleRefresh = () => {
  const idleTimeout: any = useRef(null);
  const idleTime: any = 50 * 60 * 1000; // 50 minutes

  const resetTimer = () => {
    if (idleTimeout.current) clearTimeout(idleTimeout.current);
    idleTimeout.current = setTimeout(() => {
      window.location.reload(); // Refresh the page
    }, idleTime);
  };

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'scroll', 'click'];

    // Attach event listeners
    events.forEach((event: any) => window.addEventListener(event, resetTimer));

    // Start timer on mount
    resetTimer();

    return () => {
      // Cleanup on unmount
      events.forEach((event: any) => window.removeEventListener(event, resetTimer));
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default IdleRefresh;
