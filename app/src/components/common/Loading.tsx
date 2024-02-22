import { Sheet, Stack, Typography } from '@mui/joy';
import { waveform } from 'ldrs';

waveform.register();

export function Loading({ message }: { message?: string }) {
  return (
    <Sheet
      sx={{
        zIndex: 1000,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100dvw',
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <Stack
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          rowGap: 4,
        }}
      >
        <l-waveform size="35" stroke="3.5" speed="1" color="white"></l-waveform>
        <Typography component={'h1'} fontSize={24}>
          {message || 'Loading'}
        </Typography>
      </Stack>
    </Sheet>
  );
}
