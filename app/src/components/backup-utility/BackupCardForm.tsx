import {
  Stack,
  Input,
  Tooltip,
  IconButton,
  Sheet,
  Typography,
  Switch,
  Button,
} from '@mui/joy';
import { TNewBackupSetting } from '@types';
import { Dispatch, SetStateAction } from 'react';
import toast from 'react-hot-toast';
import { FaClock, FaDatabase, FaFolder } from 'react-icons/fa';
import { BiSolidDetail } from 'react-icons/bi';

export function BackupCardForm({
  type,
  newSetting,
  setNewSetting,
  originalSetting,
  onConfirm,
  setMode,
}: {
  type: 'create' | 'update';
  newSetting?: TNewBackupSetting;
  setNewSetting: Dispatch<SetStateAction<TNewBackupSetting>>;
  originalSetting?: TNewBackupSetting;
  onConfirm: () => void;
  setMode?: Dispatch<SetStateAction<'view' | 'edit'>>;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
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
              value={newSetting?.frequency || ''}
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
              placeholder="Frequency (m)..."
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
                  title="How often the file or folder should be backed up. The time is in minutes."
                >
                  <IconButton
                    tabIndex={-1}
                    sx={(theme) => ({
                      color: theme.palette.primary[300],
                    })}
                  >
                    <FaClock />
                  </IconButton>
                </Tooltip>
              }
            />
            <Input
              value={newSetting?.path || ''}
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
                  <IconButton
                    tabIndex={-1}
                    sx={(theme) => ({
                      color: theme.palette.neutral[300],
                    })}
                  >
                    <FaFolder />
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
              value={newSetting?.limit || ''}
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
                  <IconButton
                    tabIndex={-1}
                    sx={(theme) => ({
                      color: theme.palette.warning[300],
                    })}
                  >
                    <FaDatabase />
                  </IconButton>
                </Tooltip>
              }
            />
            <Input
              value={newSetting?.name || ''}
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
                  <IconButton
                    tabIndex={-1}
                    sx={(theme) => ({
                      color: theme.palette.success[300],
                    })}
                  >
                    <BiSolidDetail />
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
              minWidth: 185,
              maxWidth: 185,
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
          <Stack flexDirection={'row'} gap={2}>
            {type === 'create' ? (
              <Button
                variant="solid"
                color="success"
                type="submit"
                onClick={() => onConfirm()}
              >
                Create Backup Routine
              </Button>
            ) : (
              <>
                <Button
                  variant="solid"
                  type="button"
                  color="neutral"
                  onClick={() => {
                    setNewSetting((prev) => ({ ...prev, ...originalSetting }));
                    setMode?.('view');
                  }}
                  sx={{
                    width: '50%',
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="solid"
                  type="submit"
                  color="success"
                  onClick={() => {
                    setMode?.('view');
                    onConfirm();
                  }}
                  sx={{
                    width: '50%',
                  }}
                >
                  Update
                </Button>
              </>
            )}
          </Stack>
        </Stack>
      </Stack>
    </form>
  );
}
