import { useEffect, useState } from 'react';

export function useCountdown(initialSeconds: number, active = true) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (!active) {
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [active]);

  function reset(nextSeconds = initialSeconds) {
    setSecondsLeft(nextSeconds);
  }

  return { secondsLeft, reset };
}

export function formatCountdown(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const secondsPart = seconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(secondsPart).padStart(2, '0')}`;
}
