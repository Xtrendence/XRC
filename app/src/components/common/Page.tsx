import { Sheet } from '@mui/joy';
import { ReactNode } from 'react';
import { navigationHeight, pageHeight } from '../../globalVariables';

export function Page({ children }: { children: ReactNode }) {
  return (
    <Sheet
      sx={{
        top: navigationHeight,
        height: pageHeight,
        minHeight: pageHeight,
        maxHeight: pageHeight,
        overflow: 'hidden',
      }}
    >
      {children}
    </Sheet>
  );
}
