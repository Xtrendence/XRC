import { Stack } from '@mui/joy';
import { Page } from '../common';
import { VolumeControl } from './VolumeControl';
import { PowerControl } from './PowerControl';
import { useTitle } from '../../hooks/useTitle';

export default function ControlCenter() {
  useTitle('Control Center');

  return (
    <Page>
      <Stack gap={2}>
        <VolumeControl />
        <PowerControl />
      </Stack>
    </Page>
  );
}
