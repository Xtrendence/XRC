import { useEffect } from 'react';

export function useTitle(title: string) {
  useEffect(() => {
    document.title = `XRC | ${title}`;
  }, [title]);
}
