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
import { TNewBackupRoutine, TProcess } from '@types';
import { Dispatch, SetStateAction, useState } from 'react';
import toast from 'react-hot-toast';
import { FaClock, FaDatabase, FaFolder, FaLink } from 'react-icons/fa';
import { BiSolidDetail } from 'react-icons/bi';
import DependenciesModal from './DependenciesModal';

export function BackupCardForm({
  processOptions,
  type,
  newRoutine,
  setNewRoutine,
  originalRoutine,
  onConfirm,
  setMode,
}: {
  processOptions: Array<{
    label: string;
    id: number;
  }>;
  type: 'create' | 'update';
  newRoutine?: TNewBackupRoutine;
  setNewRoutine: Dispatch<SetStateAction<TNewBackupRoutine>>;
  originalRoutine?: TNewBackupRoutine;
  onConfirm: () => void;
  setMode?: Dispatch<SetStateAction<'view' | 'edit'>>;
}) {
  const [dependencies, setDependencies] = useState<Array<string>>(
    newRoutine?.dependencies || []
  );

  const [dependenciesModalOpen, setDependenciesModalOpen] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <DependenciesModal
        processOptions={processOptions}
        value={dependencies}
        setValue={setDependencies}
        open={dependenciesModalOpen}
        setOpen={setDependenciesModalOpen}
        onConfirm={() => {
          setNewRoutine((prev) => ({
            ...prev,
            dependencies,
          }));
        }}
        onCancel={() => setDependencies(originalRoutine?.dependencies || [])}
      />
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
              value={newRoutine?.frequency || ''}
              onChange={(e) => {
                try {
                  const frequency = parseInt(e.target.value);

                  setNewRoutine((prev) => ({
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
                  md: 210,
                },
                minWidth: {
                  xs: 300,
                  md: 210,
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
              endDecorator={
                <Tooltip
                  arrow
                  placement="bottom-start"
                  variant="soft"
                  sx={{
                    maxWidth: 380,
                  }}
                  title={
                    newRoutine?.dependencies &&
                    newRoutine?.dependencies.length > 0
                      ? `Once saved, this routine will depend on the following processes running: ${newRoutine?.dependencies?.join(
                          ', '
                        )}`
                      : `Specify which processes should be running for the backup to occur, if any.`
                  }
                >
                  <IconButton
                    tabIndex={-1}
                    sx={{
                      color:
                        dependencies.length > 0
                          ? 'rgb(164, 145, 194)'
                          : 'inherit',
                    }}
                    onClick={() => setDependenciesModalOpen(true)}
                  >
                    <FaLink />
                  </IconButton>
                </Tooltip>
              }
            />
            <Input
              value={newRoutine?.path || ''}
              onChange={(e) => {
                setNewRoutine((prev) => ({
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
              value={newRoutine?.limit || ''}
              onChange={(e) => {
                try {
                  const limit = parseInt(e.target.value);

                  setNewRoutine((prev) => ({
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
                  md: 210,
                },
                minWidth: {
                  xs: 300,
                  md: 210,
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
              value={newRoutine?.name || ''}
              onChange={(e) => {
                setNewRoutine((prev) => ({
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
              {newRoutine?.enabled ? 'Enabled' : 'Disabled'}
            </Typography>
            <Switch
              size="lg"
              color={newRoutine?.enabled ? 'success' : 'danger'}
              checked={newRoutine?.enabled}
              onChange={(e) => {
                setNewRoutine((prev) => ({
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
                    setNewRoutine((prev) => ({ ...prev, ...originalRoutine }));
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
