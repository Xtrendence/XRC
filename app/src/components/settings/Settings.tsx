import { Typography } from '@mui/joy';
import { Page } from '../common';
import { useTitle } from '../../hooks/useTitle';

export default function Settings() {
  useTitle('Settings');

  return (
    <Page>
      <Typography variant="plain">Settings</Typography>
    </Page>
  );
}
