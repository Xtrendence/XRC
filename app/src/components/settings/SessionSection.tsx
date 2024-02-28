import { Button, Card, Stack, Typography } from '@mui/joy';
import axios from 'axios';
import { apiUrl, toastOptions } from '../../globalVariables';
import toast from 'react-hot-toast';
import ConfirmationModal from '../common/ConfirmationModal';
import { useState } from 'react';
import { FaUser } from 'react-icons/fa';

export function SessionSection() {
  const [logoutType, setLogoutType] = useState<'single' | 'all'>();

  return (
    <Card>
      <ConfirmationModal
        title={`Logout Confirmation`}
        content={`Are you sure you want to log out ${
          logoutType === 'single' ? 'on this device?' : 'on all devices?'
        }`}
        open={logoutType !== undefined}
        setOpen={(value) => {
          if (!value) {
            setLogoutType(undefined);
          }
        }}
        onConfirm={() => {
          if (logoutType) {
            const token = localStorage.getItem('loginToken');

            axios
              .get(`${apiUrl}/session/logout/${token}/${logoutType}`, {
                headers: {
                  Authorization: 'Bearer ' + token,
                },
              })
              .then(() => {
                setTimeout(() => {
                  localStorage.removeItem('loginToken');
                  window.location.reload();
                }, 750);

                toast.success(
                  `You have been logged out ${
                    logoutType === 'single'
                      ? 'on this device.'
                      : 'on all devices.'
                  }`,
                  toastOptions
                );
              })
              .catch((error) => {
                toast.error(`Failed to log out.`, toastOptions);
                console.log(error);
              });
          }
        }}
        danger
      />
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
            <FaUser />
            <Typography level="h4">Session</Typography>
          </Stack>
          <Stack flexDirection={'row'} gap={2}>
            <Button
              variant="solid"
              color="danger"
              onClick={() => setLogoutType('single')}
            >
              Logout
            </Button>
            <Button
              variant="solid"
              color="danger"
              onClick={() => setLogoutType('all')}
            >
              Logout Everywhere
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}