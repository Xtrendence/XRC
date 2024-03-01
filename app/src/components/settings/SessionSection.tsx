import { Button, Card, Stack, Typography } from '@mui/joy';
import axios from 'axios';
import { apiUrl, toastOptions } from '../../globalVariables';
import toast from 'react-hot-toast';
import ConfirmationModal from '../common/ConfirmationModal';
import { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { RiLogoutBoxFill, RiLogoutBoxLine } from 'react-icons/ri';

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
              endDecorator={<RiLogoutBoxLine size={18} />}
              onClick={() => setLogoutType('single')}
            >
              Logout
            </Button>
            <Button
              variant="solid"
              color="danger"
              endDecorator={<RiLogoutBoxFill size={18} />}
              onClick={() => setLogoutType('all')}
              sx={{
                whiteSpace: 'nowrap',
              }}
            >
              Logout Everywhere
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}
