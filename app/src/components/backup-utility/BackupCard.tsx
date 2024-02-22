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
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaQuestionCircle } from 'react-icons/fa';
import { TBackupSetting } from '../../../../@types/TBackupSettings';

export function BackupCard({
  setting,
  onUpdate,
}: {
  setting: TBackupSetting;
  onUpdate: (changes: TBackupSetting) => void;
}) {
  const [changes, setChanges] = useState<TBackupSetting>(setting);

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

                  setChanges((prev) => ({
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
                  placement="right"
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
                setChanges((prev) => ({
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
                  placement="right"
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

                  setChanges((prev) => ({
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
                  placement="right"
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
                setChanges((prev) => ({
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
                  placement="right"
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
              {changes?.enabled ? 'Enabled' : 'Disabled'}
            </Typography>
            <Switch
              size="lg"
              color={changes?.enabled ? 'success' : 'danger'}
              checked={changes?.enabled}
              onChange={(e) => {
                setChanges((prev) => ({
                  ...prev,
                  enabled: e.target.checked,
                }));
              }}
            />
          </Sheet>
          <Button
            variant="solid"
            color="success"
            onClick={() => onUpdate(changes)}
          >
            Update Backup Routine
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
