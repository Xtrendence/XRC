import {
  Button,
  Card,
  IconButton,
  Input,
  Sheet,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from '@mui/joy';
import { Dispatch, SetStateAction } from 'react';
import toast from 'react-hot-toast';
import { FaQuestionCircle } from 'react-icons/fa';

export type TNewBackupSetting = {
  enabled?: boolean;
  name?: string;
  path?: string;
  frequency?: number;
  limit?: number;
};

export function CreateBackupCard({
  newSetting,
  setNewSetting,
  onCreate,
}: {
  newSetting?: TNewBackupSetting;
  setNewSetting: Dispatch<SetStateAction<TNewBackupSetting>>;
  onCreate: () => void;
}) {
  return (
    <Card>
      <Stack
        alignItems={'center'}
        justifyContent={'space-between'}
        gap={2}
        sx={{
          flexDirection: {
            xs: 'column',
            md: 'row',
          },
        }}
      >
        <Stack gap={2}>
          <Stack
            gap={2}
            sx={{
              alignItems: 'center',
              flexDirection: {
                xs: 'column',
                md: 'row',
              },
            }}
          >
            <Input
              onChange={(e) => {
                try {
                  const frequency = parseInt(e.target.value);

                  setNewSetting((prev) => ({
                    ...prev,
                    frequency,
                  }));
                } catch (error) {
                  toast.error('Invalid input type. Please enter a number.');
                  console.log(error);
                }
              }}
              placeholder="Frequency (s)..."
              sx={{
                maxWidth: {
                  xs: 300,
                  md: 200,
                },
                minWidth: {
                  xs: 300,
                  md: 200,
                },
              }}
              startDecorator={
                <Tooltip
                  arrow
                  placement="bottom-start"
                  variant="soft"
                  sx={{
                    maxWidth: 300,
                  }}
                  title="How often the file or folder should be backed up. The time is in seconds."
                >
                  <IconButton tabIndex={-1}>
                    <FaQuestionCircle />
                  </IconButton>
                </Tooltip>
              }
            />
            <Input
              onChange={(e) => {
                setNewSetting((prev) => ({
                  ...prev,
                  path: e.target.value,
                }));
              }}
              sx={{
                maxWidth: {
                  xs: 300,
                  md: 400,
                },
                minWidth: {
                  xs: 300,
                  md: 400,
                },
              }}
              placeholder="Path..."
              startDecorator={
                <Tooltip
                  arrow
                  placement="bottom-start"
                  variant="soft"
                  sx={{
                    maxWidth: 300,
                  }}
                  title="Absolute path to the file or folder that should be backed up."
                >
                  <IconButton tabIndex={-1}>
                    <FaQuestionCircle />
                  </IconButton>
                </Tooltip>
              }
            />
          </Stack>
          <Stack
            gap={2}
            sx={{
              alignItems: 'center',
              flexDirection: {
                xs: 'column',
                md: 'row',
              },
            }}
          >
            <Input
              onChange={(e) => {
                try {
                  const limit = parseInt(e.target.value);

                  setNewSetting((prev) => ({
                    ...prev,
                    limit,
                  }));
                } catch (error) {
                  toast.error('Invalid input type. Please enter a number.');
                  console.log(error);
                }
              }}
              placeholder="Limit..."
              sx={{
                maxWidth: {
                  xs: 300,
                  md: 200,
                },
                minWidth: {
                  xs: 300,
                  md: 200,
                },
              }}
              startDecorator={
                <Tooltip
                  arrow
                  placement="bottom-start"
                  variant="soft"
                  sx={{
                    maxWidth: 300,
                  }}
                  title="The number of backups that should be kept before the oldest one is deleted each time once this limit has been reached."
                >
                  <IconButton tabIndex={-1}>
                    <FaQuestionCircle />
                  </IconButton>
                </Tooltip>
              }
            />
            <Input
              onChange={(e) => {
                setNewSetting((prev) => ({
                  ...prev,
                  name: e.target.value,
                }));
              }}
              sx={{
                maxWidth: {
                  xs: 300,
                  md: 400,
                },
                minWidth: {
                  xs: 300,
                  md: 400,
                },
              }}
              placeholder="Name..."
              startDecorator={
                <Tooltip
                  arrow
                  placement="bottom-start"
                  variant="soft"
                  sx={{
                    maxWidth: 300,
                  }}
                  title="Makes it easier to identify what the backup is for."
                >
                  <IconButton tabIndex={-1}>
                    <FaQuestionCircle />
                  </IconButton>
                </Tooltip>
              }
            />
          </Stack>
        </Stack>
        <Stack gap={2}>
          <Sheet
            variant="soft"
            sx={{
              borderRadius: 'md',
              padding: 1,
              maxHeight: '36px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography fontWeight={'bold'} variant="plain">
              {newSetting?.enabled ? 'Enabled' : 'Disabled'}
            </Typography>
            <Switch
              size="lg"
              color={newSetting?.enabled ? 'success' : 'danger'}
              checked={newSetting?.enabled}
              onChange={(e) => {
                setNewSetting((prev) => ({
                  ...prev,
                  enabled: e.target.checked,
                }));
              }}
            />
          </Sheet>
          <Button variant="solid" color="success" onClick={() => onCreate()}>
            Create Backup Routine
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
