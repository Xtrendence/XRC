import {
  Modal,
  ModalDialog,
  DialogTitle,
  Divider,
  DialogContent,
  DialogActions,
  Button,
  Input,
  IconButton,
  Tooltip,
  Stack,
} from '@mui/joy';
import axios from 'axios';
import { useState } from 'react';
import { FaEye, FaEyeSlash, FaKey, FaUser } from 'react-icons/fa';
import { apiUrl, toastOptions } from '../../globalVariables';
import toast from 'react-hot-toast';
import { useInterval } from '../../hooks/useInterval';
import { encryptRsa } from '../../utils';
import { PasswordChangeModal } from '../settings/PasswordChangeModal';
import { Loading } from '../common';

export function Login() {
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [passwordChangeRequired, setPasswordChangeRequired] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const checkSession = () => {
    const token = localStorage.getItem('loginToken');

    if (!token) {
      setLoading(false);
      setOpen(true);
      return;
    }

    axios
      .get(`${apiUrl}/session/validate`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setLoading(false);

        const valid = res.data.valid;

        if (valid === true) {
          localStorage.setItem('loginToken', token);
          setOpen(false);

          if (res.data.passwordChangeRequired === true) {
            setPasswordChangeRequired(true);
          }

          return;
        }

        setOpen(true);
      })
      .catch((error) => {
        console.log(error);
        toast.dismiss();
        toast.error('Error validating session.', toastOptions);
        setLoading(false);
        setOpen(true);
      });
  };

  const handleLogin = async (password: string) => {
    const res = await axios.get(`${apiUrl}/key/public`);

    const publicKey = res.data;

    const encryptedPassword = encryptRsa(password, publicKey);

    const loading = toast.loading('Logging in...', toastOptions);

    axios
      .post(`${apiUrl}/session/login/`, { password: encryptedPassword })
      .then((res) => {
        toast.dismiss(loading);

        if (res.data?.token) {
          toast.success('Logged in.', toastOptions);

          if (res.data.passwordChangeRequired === true) {
            setPasswordChangeRequired(true);
          }

          localStorage.setItem('loginToken', res.data.token);
          setOpen(false);
        } else {
          if (res.data?.message) {
            toast.error(res.data.message, toastOptions);
            return;
          }

          toast.error('Could not log in.', toastOptions);
        }
      })
      .catch((error) => {
        toast.dismiss(loading);
        console.log(error);
        toast.error('Could not log in.', toastOptions);
      });
  };

  useInterval(checkSession, 1_000 * 60, {
    initialDelay: 10,
    immediate: true,
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {(open || passwordChangeRequired) && (
        <Stack
          top={0}
          left={0}
          width="100dvw"
          height="100dvh"
          zIndex={1001}
          position="fixed"
          sx={{
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center',
            backgroundImage: 'url(/background.jpg)',
          }}
        />
      )}
      {passwordChangeRequired && (
        <PasswordChangeModal
          hideBackdrop
          required={true}
          open={passwordChangeRequired}
          setOpen={setPasswordChangeRequired}
        />
      )}
      <Modal open={open} hideBackdrop>
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
              <FaUser />
              Login
            </DialogTitle>
            <Divider />
            <DialogContent>
              <Input
                type={showPassword ? 'text' : 'password'}
                sx={{
                  overflow: 'hidden',
                }}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                placeholder="Password..."
                startDecorator={
                  <Tooltip
                    arrow
                    placement="bottom-start"
                    variant="soft"
                    sx={{
                      maxWidth: 300,
                    }}
                    title={`The default password is "admin". This will have already been changed after the first login if you've already used XRC.`}
                  >
                    <IconButton
                      tabIndex={-1}
                      sx={(theme) => ({
                        color: theme.palette.warning[300],
                      })}
                    >
                      <FaKey />
                    </IconButton>
                  </Tooltip>
                }
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
            </DialogContent>
            <DialogActions
              sx={{
                pt: 0,
              }}
            >
              <Button
                type="submit"
                variant="solid"
                color={'primary'}
                onClick={() => handleLogin(password)}
              >
                Login
              </Button>
              <Button
                type="button"
                variant="soft"
                color="neutral"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Refresh
              </Button>
            </DialogActions>
          </ModalDialog>
        </form>
      </Modal>
    </>
  );
}
