import { Page } from '../common';
import { useTitle } from '../../hooks/useTitle';
import { Stack } from '@mui/joy';
import { SessionSection } from './SessionSection';
import { PasswordSection } from './PasswordSection';
import { BackupSection } from './BackupSection';
import { DonationSection } from './DonationSection';
import { DeveloperSection } from './DeveloperSection';

export default function Settings() {
  useTitle('Settings');

  return (
    <Page>
      <Stack gap={2} width={'calc(100% - 16px)'}>
        <SessionSection />
        <PasswordSection />
        <BackupSection />
        <DeveloperSection />
        <DonationSection />
      </Stack>
    </Page>
  );
}
