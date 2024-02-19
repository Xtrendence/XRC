import { useEffect, useRef } from 'react';

export function useInterval(
  callback: () => void,
  delay: number | null,
  args?: {
    immediate: boolean;
    initialDelay: number;
  }
) {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (args?.immediate && delay !== null) {
      setTimeout(() => {
        savedCallback.current?.();
      }, args?.initialDelay || 0);
    }
  }, [args?.immediate, args?.initialDelay, delay]);

  useEffect(() => {
    if (delay === null) {
      return;
    }
    const interval = setInterval(() => {
      savedCallback.current?.();
    }, delay);

    return () => clearInterval(interval);
  }, [delay]);
}
