import { Page } from '../common';
import { useTitle } from '../../hooks/useTitle';
import { Stack } from '@mui/joy';
import { SessionSection } from './SessionSection';
import { PasswordSection } from './PasswordSection';

export default function Settings() {
  useTitle('Settings');

  return (
    <Page>
      <Stack gap={2}>
        <SessionSection />
        <PasswordSection />
      </Stack>
    </Page>
  );
}
