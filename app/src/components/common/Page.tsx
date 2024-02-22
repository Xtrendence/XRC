import { Sheet, Stack } from '@mui/joy';
import { ReactNode } from 'react';
import {
  contentHeight,
  navigationHeight,
  pageHeight,
  pageMargin,
} from '../../globalVariables';

export function Page({
  overflowX = 'hidden',
  children,
}: {
  overflowX?: string;
  children: ReactNode;
}) {
  return (
    <>
      <Sheet
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
        <Sheet
          sx={(theme) => ({
            background: 'url(/background.jpg)',
            backgroundColor: theme.palette.background.surface,
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center',
            filter: 'blur(12px)',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            transform: 'scale(1.1)',
          })}
        />
      </Sheet>
      <Sheet
        sx={{
          background: 'rgba(0, 0, 0, 0.5)',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
        }}
      />
      <Sheet
        sx={{
          height: pageHeight,
          minHeight: pageHeight,
          maxHeight: pageHeight,
          overflow: 'hidden',
          overflowX,
          position: 'absolute',
          top: navigationHeight,
          left: 0,
          width: '100%',
          zIndex: 3,
          background: 'transparent',
          '@media (min-width: 1400px)': {
            justifyContent: 'center',
            display: 'flex',
          },
        }}
      >
        <Stack
          margin={pageMargin}
          overflow={`${overflowX} auto`}
          maxHeight={contentHeight}
          boxSizing={'border-box'}
          sx={{
            '@media (min-width: 1400px)': {
              minWidth: 'calc(1400px - 32px)',
              maxWidth: 'calc(1400px - 32px)',
            },
          }}
        >
          {children}
        </Stack>
      </Sheet>
    </>
  );
}
