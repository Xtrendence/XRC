import { Page } from '../common';
import { useTitle } from '../../hooks/useTitle';
import { Stack } from '@mui/joy';
import { SessionSection } from './SessionSection';
import { PasswordSection } from './PasswordSection';
import { BackupSection } from './BackupSection';

export default function Settings() {
  useTitle('Settings');

  return (
    <Page>
      <Stack gap={2}>
        <SessionSection />
        <PasswordSection />
        <BackupSection />
      </Stack>
    </Page>
  );
}
