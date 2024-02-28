import {
  Modal,
  ModalDialog,
  DialogTitle,
  Divider,
  DialogContent,
  Input,
  Tooltip,
  IconButton,
  DialogActions,
  Button,
  Stack,
} from '@mui/joy';
import { Dispatch, SetStateAction, useState } from 'react';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaKey } from 'react-icons/fa';
import { FaShield } from 'react-icons/fa6';
import { apiUrl, toastOptions } from '../../globalVariables';
import axios from 'axios';
import { encryptRsa } from '../../utils';

export function PasswordChangeModal({
  hideBackdrop,
  required,
  open,
  setOpen,
}: {
  hideBackdrop?: boolean;
  required?: boolean;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatNewPassword, setRepeatNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleUpdatePassword = async (
    currentPassword: string,
    newPassword: string,
    repeatNewPassword: string
  ) => {
    if (
      currentPassword?.trim() === '' ||
      newPassword?.trim() === '' ||
      repeatNewPassword?.trim() === ''
    ) {
      toast.error('Please fill all fields', toastOptions);
      return;
    }

    if (currentPassword === newPassword) {
      toast.error(
        'New password must be different from the current password',
        toastOptions
      );
      return;
    }

    if (newPassword !== repeatNewPassword) {
      toast.error('New passwords do not match', toastOptions);
      return;
    }

    const res = await axios.get(`${apiUrl}/key/public`);

    const publicKey = res.data;

    const encryptedCurrentPassword = encryptRsa(currentPassword, publicKey);
    const encryptedNewPassword = encryptRsa(newPassword, publicKey);

    const loading = toast.loading('Changing Password...', toastOptions);

    axios
      .put(
        `${apiUrl}/settings/password`,
        {
          currentPassword: encryptedCurrentPassword,
          newPassword: encryptedNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('loginToken')}`,
          },
        }
      )
      .then((res) => {
        toast.dismiss(loading);

        if (res.status === 200) {
          toast.success('Password changed successfully.', toastOptions);
          setOpen(false);
        } else {
          if (res.data?.message) {
            toast.error(res.data.message, toastOptions);
          } else {
            toast.error('Error changing password.', toastOptions);
          }
        }
      })
      .catch((error) => {
        toast.dismiss(loading);
        console.log(error);

        if (error?.response?.data?.message) {
          toast.error(error.response.data.message, toastOptions);
        } else {
          toast.error('Error changing password.', toastOptions);
        }
      });
  };

  return (
    <Modal open={open} hideBackdrop={hideBackdrop}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle
            sx={{
              alignItems: 'center',
            }}
          >
            <FaShield />
            Change Password
          </DialogTitle>
          <Divider />
          <DialogContent>
            <Stack gap={1}>
              <Input
                type={showPassword ? 'text' : 'password'}
                sx={{
                  overflow: 'hidden',
                }}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                }}
                placeholder="Current Password..."
                endDecorator={
                  <Tooltip
                    arrow
                    placement="bottom-start"
                    variant="soft"
                    sx={{
                      maxWidth: 300,
                    }}
                    title={showPassword ? 'Hide Password' : 'Show Password'}
                  >
                    <IconButton
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </IconButton>
                  </Tooltip>
                }
              />
              <Input
                type={showPassword ? 'text' : 'password'}
                sx={{
                  overflow: 'hidden',
                }}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
                placeholder="New Password..."
                endDecorator={
                  <Tooltip
                    arrow
                    placement="bottom-start"
                    variant="soft"
                    sx={{
                      maxWidth: 300,
                    }}
                    title={showPassword ? 'Hide Password' : 'Show Password'}
                  >
                    <IconButton
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </IconButton>
                  </Tooltip>
                }
              />
              <Input
                type={showPassword ? 'text' : 'password'}
                sx={{
                  overflow: 'hidden',
                }}
                value={repeatNewPassword}
                onChange={(e) => {
                  setRepeatNewPassword(e.target.value);
                }}
                placeholder="Repeat Password..."
                endDecorator={
                  <Tooltip
                    arrow
                    placement="bottom-start"
                    variant="soft"
                    sx={{
                      maxWidth: 300,
                    }}
                    title={showPassword ? 'Hide Password' : 'Show Password'}
                  >
                    <IconButton
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </IconButton>
                  </Tooltip>
                }
              />
            </Stack>
          </DialogContent>
          <DialogActions
            sx={{
              pt: 0,
              justifyContent: 'space-evenly',
            }}
          >
            <Button
              type="submit"
              variant="solid"
              color={'primary'}
              onClick={() =>
                handleUpdatePassword(
                  currentPassword,
                  newPassword,
                  repeatNewPassword
                )
              }
            >
              Change Password
            </Button>
            {!required && (
              <Button
                type="button"
                variant="soft"
                color="neutral"
                sx={{
                  flexGrow: 1,
                }}
                onClick={() => {
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
            )}
          </DialogActions>
        </ModalDialog>
      </form>
    </Modal>
  );
}
