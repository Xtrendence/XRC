import { Button, Card, Stack, Typography } from '@mui/joy';
import { useState } from 'react';
import { FaShield } from 'react-icons/fa6';
import { PasswordChangeModal } from './PasswordChangeModal';

export function PasswordSection() {
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <PasswordChangeModal open={open} setOpen={setOpen} />
      <Stack>
        <Stack
          gap={2}
          sx={{
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Stack flexDirection={'row'} alignItems={'center'} gap={2}>
            <FaShield />
            <Typography level="h4">Security</Typography>
          </Stack>
          <Stack flexDirection={'row'} gap={2}>
            <Button
              variant="solid"
              color="primary"
              onClick={() => setOpen(true)}
            >
              Change Password
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}
