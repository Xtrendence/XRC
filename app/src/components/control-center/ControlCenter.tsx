import { Stack } from '@mui/joy';
import { Page } from '../common';
import { VolumeControl } from './VolumeControl';
import { PowerControl } from './PowerControl';

export default function ControlCenter() {
  return (
    <Page>
      <Stack gap={2}>
        <VolumeControl />
        <PowerControl />
      </Stack>
    </Page>
  );
}
