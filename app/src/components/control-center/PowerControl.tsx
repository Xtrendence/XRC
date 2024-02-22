import { Card, IconButton, Stack, Tooltip } from '@mui/joy';
import axios from 'axios';
import { FaLock, FaPowerOff, FaRedo } from 'react-icons/fa';
import { GiNightSleep } from 'react-icons/gi';
import { apiUrl, toastOptions } from '../../globalVariables';
import toast from 'react-hot-toast';
import ConfirmationModal from '../common/ConfirmationModal';
import { useState } from 'react';

export function PowerControl() {
  const [selectedCommand, setSelectedCommand] = useState<
    'shutdown' | 'restart' | 'sleep' | 'lock'
  >();

  return (
    <Card>
      <ConfirmationModal
        title={`${selectedCommand
          ?.charAt(0)
          .toUpperCase()}${selectedCommand?.slice(1)} Confirmation`}
        content={`Are you sure you want to perform a "${selectedCommand}" command?`}
        open={selectedCommand !== undefined}
        setOpen={(value) => {
          if (!value) {
            setSelectedCommand(undefined);
          }
        }}
        onConfirm={() => {
          if (selectedCommand) {
            axios
              .post(`${apiUrl}/${selectedCommand}`)
              .then(() => {
                toast.success(
                  `Performed "${selectedCommand}" command.`,
                  toastOptions
                );
              })
              .catch((error) => {
                toast.error(
                  `Failed to perform "${selectedCommand}" command.`,
                  toastOptions
                );
                console.log(error);
              });
          }
        }}
        danger={selectedCommand === 'lock' ? false : true}
      />
      <Stack>
        <Stack flexDirection={'row'} gap={2}>
          <Tooltip title="Shutdown" placement="top" variant="soft">
            <IconButton
              size="lg"
              variant="soft"
              onClick={() => setSelectedCommand('shutdown')}
            >
              <FaPowerOff />
            </IconButton>
          </Tooltip>
          <Tooltip title="Restart" placement="top" variant="soft">
            <IconButton
              size="lg"
              variant="soft"
              onClick={() => setSelectedCommand('restart')}
            >
              <FaRedo />
            </IconButton>
          </Tooltip>
          <Tooltip title="Sleep" placement="top" variant="soft">
            <IconButton
              size="lg"
              variant="soft"
              onClick={() => setSelectedCommand('sleep')}
            >
              <GiNightSleep />
            </IconButton>
          </Tooltip>
          <Tooltip title="Lock" placement="top" variant="soft">
            <IconButton
              size="lg"
              variant="soft"
              onClick={() => setSelectedCommand('lock')}
            >
              <FaLock />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Card>
  );
}
