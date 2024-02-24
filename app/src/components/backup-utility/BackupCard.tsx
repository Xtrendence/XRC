import {
  Box,
  Button,
  Card,
  Chip,
  Sheet,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from '@mui/joy';
import { Dispatch, SetStateAction, useState } from 'react';
import { FaClock, FaDatabase, FaFile, FaFolder } from 'react-icons/fa';
import { BiSolidDetail } from 'react-icons/bi';
import { TNewBackupRoutine } from '@types';
import { BackupCardForm } from './BackupCardForm';

export function BackupCard({
  routine,
  onUpdate,
  setRoutineToDelete,
}: {
  routine: TNewBackupRoutine;
  onUpdate: (changes: TNewBackupRoutine) => void;
  setRoutineToDelete: Dispatch<SetStateAction<TNewBackupRoutine | undefined>>;
}) {
  const originalRoutine = routine;

  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [changes, setChanges] = useState<TNewBackupRoutine>(routine);

  return (
    <>
      {mode === 'edit' ? (
        <Card>
          <BackupCardForm
            type="update"
            newRoutine={changes}
            setNewRoutine={setChanges}
            originalRoutine={originalRoutine}
            onConfirm={() => onUpdate(changes)}
            setMode={setMode}
          />
        </Card>
      ) : (
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
                <Stack flexDirection={'row'} gap={2}>
                  <Tooltip
                    arrow
                    placement="bottom-start"
                    variant="soft"
                    sx={{
                      maxWidth: 300,
                    }}
                    title="How often the file or folder should be backed up. The time is in minutes."
                  >
                    <Chip
                      sx={{
                        minHeight: '36px',
                        maxHeight: '36px',
                        paddingTop: 0.1,
                        borderWidth: 2,
                        display: 'flex',
                        flexDirection: 'row',
                      }}
                      size="lg"
                      color="primary"
                      variant="outlined"
                      startDecorator={
                        <Box
                          sx={{
                            marginBottom: -0.5,
                            minWidth: 16,
                            maxWidth: 16,
                            boxSizing: 'border-box',
                          }}
                        >
                          <FaClock />
                        </Box>
                      }
                    >
                      {routine.frequency}m
                    </Chip>
                  </Tooltip>
                  <Tooltip
                    arrow
                    placement="bottom-start"
                    variant="soft"
                    sx={{
                      maxWidth: 300,
                    }}
                    title="The number of backups that should be kept before the oldest one is deleted each time once this limit has been reached."
                  >
                    <Chip
                      sx={{
                        minHeight: '36px',
                        maxHeight: '36px',
                        paddingTop: 0.1,
                        borderWidth: 2,
                        display: {
                          xs: 'flex',
                          md: 'none',
                        },
                        flexDirection: 'row',
                      }}
                      size="lg"
                      color="warning"
                      variant="outlined"
                      startDecorator={
                        <Box
                          sx={{
                            marginBottom: -0.5,
                            minWidth: 16,
                            maxWidth: 16,
                            boxSizing: 'border-box',
                          }}
                        >
                          <FaDatabase />
                        </Box>
                      }
                    >
                      {routine.limit}
                    </Chip>
                  </Tooltip>
                </Stack>
                <Tooltip
                  arrow
                  placement="bottom-start"
                  variant="soft"
                  sx={{
                    maxWidth: 300,
                  }}
                  title="Absolute path to the file or folder that should be backed up."
                >
                  <Chip
                    sx={{
                      minHeight: '36px',
                      maxHeight: '36px',
                      paddingTop: 0.1,
                      borderWidth: 2,
                      display: 'flex',
                      flexDirection: 'row',
                      maxWidth: {
                        xs: 'calc(100dvw - 32px - 64px)',
                        md: 500,
                        lg: 800,
                      },
                    }}
                    size="lg"
                    color="neutral"
                    variant="outlined"
                    startDecorator={
                      <Box
                        sx={{
                          marginBottom: -0.5,
                          minWidth: 16,
                          maxWidth: 16,
                          boxSizing: 'border-box',
                          marginRight: routine.type === 'folder' ? 0.5 : 0,
                        }}
                      >
                        {routine.type === 'folder' ? <FaFolder /> : <FaFile />}
                      </Box>
                    }
                  >
                    {routine.path}
                  </Chip>
                </Tooltip>
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
                <Tooltip
                  arrow
                  placement="bottom-start"
                  variant="soft"
                  sx={{
                    maxWidth: 300,
                  }}
                  title="The number of backups that should be kept before the oldest one is deleted each time once this limit has been reached."
                >
                  <Chip
                    sx={{
                      minHeight: '36px',
                      maxHeight: '36px',
                      paddingTop: 0.1,
                      borderWidth: 2,
                      display: {
                        xs: 'none',
                        md: 'flex',
                      },
                      flexDirection: 'row',
                    }}
                    size="lg"
                    color="warning"
                    variant="outlined"
                    startDecorator={
                      <Box
                        sx={{
                          marginBottom: -0.5,
                          minWidth: 16,
                          maxWidth: 16,
                          boxSizing: 'border-box',
                        }}
                      >
                        <FaDatabase />
                      </Box>
                    }
                  >
                    {routine.limit}
                  </Chip>
                </Tooltip>
                <Tooltip
                  arrow
                  placement="bottom-start"
                  variant="soft"
                  sx={{
                    maxWidth: 300,
                  }}
                  title="Makes it easier to identify what the backup is for."
                >
                  <Chip
                    sx={{
                      minHeight: '36px',
                      maxHeight: '36px',
                      paddingTop: 0.1,
                      borderWidth: 2,
                      display: 'flex',
                      flexDirection: 'row',
                    }}
                    size="lg"
                    color="success"
                    variant="outlined"
                    startDecorator={
                      <Box
                        sx={{
                          marginBottom: -0.5,
                          minWidth: 16,
                          maxWidth: 16,
                          boxSizing: 'border-box',
                        }}
                      >
                        <BiSolidDetail />
                      </Box>
                    }
                  >
                    {routine.name}
                  </Chip>
                </Tooltip>
              </Stack>
            </Stack>
            <Stack gap={2}>
              <Tooltip
                arrow
                placement="left"
                variant="soft"
                sx={{
                  maxWidth: 300,
                }}
                title={`Click on the "Edit" button to enable or disable this backup routine.`}
              >
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
                    opacity: 0.75,
                    cursor: 'not-allowed',
                  }}
                >
                  <Typography
                    fontWeight={'bold'}
                    variant="plain"
                    sx={{
                      pointerEvents: 'none',
                    }}
                  >
                    {changes?.enabled ? 'Enabled' : 'Disabled'}
                  </Typography>
                  <Switch
                    size="lg"
                    color={changes?.enabled ? 'success' : 'danger'}
                    checked={changes?.enabled}
                    sx={{
                      pointerEvents: 'none',
                    }}
                  />
                </Sheet>
              </Tooltip>
              <Stack flexDirection={'row'} gap={2}>
                <Button
                  variant="solid"
                  color="danger"
                  onClick={() => setRoutineToDelete(routine)}
                  sx={{
                    width: '50%',
                  }}
                >
                  Delete
                </Button>
                <Button
                  variant="solid"
                  color="primary"
                  onClick={() => setMode('edit')}
                  sx={{
                    width: '50%',
                  }}
                >
                  Edit
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Card>
      )}
    </>
  );
}
