import {
  Modal,
  ModalDialog,
  DialogTitle,
  Divider,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Chip,
  Sheet,
  CircularProgress,
  IconButton,
} from '@mui/joy';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { FaFile, FaTrash } from 'react-icons/fa';
import { TBackupFiles } from '../../../../@types/TBackupFiles';
import axios from 'axios';
import { apiUrl, toastOptions } from '../../globalVariables';
import { lineWobble } from 'ldrs';
import toast from 'react-hot-toast';
import { DirectoryTree, TBackupRoutine } from '@types';
import { FaChevronDown, FaChevronRight, FaHardDrive } from 'react-icons/fa6';
import { formatFileSize } from '../../utils';
import { BiSolidDetail } from 'react-icons/bi';
import { useInterval } from '../../hooks/useInterval';
import ConfirmationModal from '../common/ConfirmationModal';

lineWobble.register();

export function BackupFilesModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [loading, setLoading] = useState(true);
  const [backups, setBackups] = useState<TBackupFiles>([]);
  const [sizes, setSizes] = useState<
    Array<{
      id: string;
      size: number;
    }>
  >([]);
  const [expanded, setExpanded] = useState<Array<string>>([]);
  const [refreshCount, setRefreshCount] = useState<number>();

  const [backupToDelete, setBackupToDelete] = useState<{
    id: string;
    date: string;
  }>();

  const handleClose = useCallback(() => {
    setOpen(false);
    setLoading(true);
    setExpanded([]);
    setBackups([]);
    setSizes([]);
    setRefreshCount(undefined);
  }, [setOpen]);

  const getBackups = useCallback(() => {
    const token = localStorage.getItem('loginToken');

    axios
      .get(`${apiUrl}/backup/files`, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((response) => {
        setTimeout(() => {
          setLoading(false);
          setBackups(response.data.backups);
          setSizes(response.data.sizes);
        }, 750);
      })
      .catch((error) => {
        setOpen(false);
        toast.error(`Failed to get backup files.`, toastOptions);
        console.log(error);
      });
  }, [setOpen]);

  useEffect(() => {
    if (open) {
      getBackups();
    } else {
      handleClose();
    }
  }, [getBackups, handleClose, open]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshCount((prev) => (prev || 100) - 5);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useInterval(() => {
    if (open) {
      getBackups();
      setRefreshCount(100);
    }
  }, 20 * 1000);

  const getIndentation = (layer: number) => {
    if (layer === 0) return 2;
    if (layer === 1) return 0;
    if (layer === 2) return 10;
    return 4;
  };

  const getFileIndentation = (layer: number) => {
    if (layer === 1) return 5.6;
    return 4;
  };

  const renderFiles = (
    directory: DirectoryTree,
    layer = 0,
    routine: TBackupRoutine
  ) => {
    const getDirectoryName = () => {
      if (layer === 0) {
        return `${routine.name} - ${directory.children?.length || 0} ${
          directory.children?.length === 1 ? 'Backup' : 'Backups'
        }`;
      } else if (layer === 1) {
        return new Date(Number(directory.name.split('-')[0])).toLocaleString();
      } else {
        return directory.name.replace(/-/g, '‑');
      }
    };

    return (
      <Stack ml={getIndentation(layer)}>
        <Accordion
          variant="plain"
          sx={{
            '.MuiAccordionSummary-button': {
              cursor: 'default',
              outline: 'none',
            },
            '.MuiAccordionSummary-button:hover': {
              background: 'transparent !important',
            },
            '.MuiAccordionSummary-button:active': {
              background: 'transparent !important',
            },
          }}
          expanded={expanded.includes(directory.path)}
          onChange={(_, expand) => {
            setExpanded((prev) => {
              if (expand) return [...prev, directory.path];
              return prev.filter((path) => path !== directory.path);
            });
          }}
        >
          <Stack flexDirection={'row'} alignItems={'center'} gap={1}>
            {layer === 1 && (
              <IconButton
                onClick={() => {
                  setBackupToDelete({
                    id: routine.id,
                    date: directory.name,
                  });
                }}
                color="danger"
                variant="plain"
                sx={{
                  minHeight: 40,
                  maxHeight: 40,
                  mb: -1,
                }}
              >
                <FaTrash />
              </IconButton>
            )}
            <AccordionSummary
              variant="plain"
              sx={{
                justifyContent: 'flex-start',
                display: layer > 1 ? 'inline' : 'flex',
              }}
              indicator={null}
            >
              <Stack
                sx={(theme) => ({
                  mt: layer === 0 ? 0 : 1,
                  mr: 2,
                  flexGrow: 1,
                  cursor: 'pointer',
                  background: theme.palette.background.level1,
                  padding: 1,
                  borderRadius: 'sm',
                  '&:hover': {
                    background: theme.palette.background.level2,
                  },
                })}
                flexDirection={'row'}
                alignItems={'center'}
                gap={1}
              >
                <Stack>
                  {expanded.includes(directory.path) ? (
                    <FaChevronDown
                      style={{
                        marginTop: -2,
                      }}
                    />
                  ) : (
                    <FaChevronRight />
                  )}
                </Stack>
                <Stack
                  flexGrow={1}
                  flexDirection={'row'}
                  gap={4}
                  justifyContent={'space-between'}
                >
                  <Typography
                    sx={{
                      wordBreak: 'keep-all',
                      whiteSpace: 'nowrap',
                      flexWrap: 'nowrap',
                    }}
                  >
                    {getDirectoryName()}
                  </Typography>
                  <Chip variant="outlined">
                    {formatFileSize(directory?.size || 0)}
                  </Chip>
                </Stack>
              </Stack>
            </AccordionSummary>
          </Stack>
          <AccordionDetails
            sx={{
              display: 'flex',
              overflow: 'visible !important',
              '.MuiAccordionDetails-content': {
                overflow: 'visible !important',
                display: 'flex',
              },
            }}
          >
            {expanded.includes(directory.path) &&
              directory.children &&
              directory.children
                .sort((a, b) => {
                  if (layer === 0) {
                    return (
                      Number(b.name.split('-')[0]) -
                      Number(a.name.split('-')[0])
                    );
                  }

                  if (a.type === 'directory' && b.type === 'file') return -1;
                  if (a.type === 'file' && b.type === 'directory') return 1;
                  return 0;
                })
                .map((child) => (
                  <Stack
                    key={child.path}
                    sx={{
                      display: 'inline',
                    }}
                  >
                    {child.children ? (
                      renderFiles(child, layer + 1, routine)
                    ) : (
                      <Sheet
                        sx={(theme) => ({
                          display: 'inline-flex',
                          flexDirection: 'row',
                          ml: getFileIndentation(layer),
                          mt: 1,
                          pt: 0.5,
                          pb: 0.5,
                          pl: 1,
                          pr: 0.5,
                          mr: 2,
                          gap: 2,
                          borderRadius: 'sm',
                          background: theme.palette.neutral[700],
                        })}
                      >
                        <Typography
                          sx={{
                            wordBreak: 'keep-all',
                            whiteSpace: 'nowrap',
                            flexWrap: 'nowrap',
                          }}
                        >
                          {child.name.replace(/-/g, '‑')}
                        </Typography>
                        <Chip variant="outlined">
                          {formatFileSize(child?.size || 0)}
                        </Chip>
                      </Sheet>
                    )}
                  </Stack>
                ))}
          </AccordionDetails>
        </Accordion>
      </Stack>
    );
  };

  return (
    <>
      <ConfirmationModal
        title="Delete Backup"
        content={
          <>
            <Typography>{`Are you sure you want to delete the backup performed at the following date?`}</Typography>
            <Chip
              variant="outlined"
              color="danger"
              size="lg"
              sx={{
                mt: 1,
                pt: 1,
                pb: 1,
                minWidth: '100%',
                textAlign: 'center',
              }}
            >
              {new Date(
                Number(backupToDelete?.date?.split('-')[0])
              ).toLocaleString()}
            </Chip>
          </>
        }
        open={backupToDelete !== undefined}
        setOpen={(value) => {
          if (!value) {
            setBackupToDelete(undefined);
          }
        }}
        onConfirm={() => {
          if (backupToDelete) {
            axios
              .delete(`${apiUrl}/backup/files/${backupToDelete.id}`, {
                headers: {
                  Authorization: 'Bearer ' + localStorage.getItem('loginToken'),
                },
                data: {
                  date: backupToDelete.date,
                },
              })
              .then(() => {
                getBackups();
              })
              .catch((error) => {
                toast.error('Failed to delete backup routine.', toastOptions);
                console.log(error);
              });
          }

          setBackupToDelete(undefined);
        }}
        danger
      />
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          sx={{
            minWidth: {
              xs: 360,
              sm: 500,
              md: 600,
            },
            maxWidth: {
              xs: 360,
              sm: 500,
              md: 600,
            },
          }}
        >
          <DialogTitle
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            Manage Backup Files
            <Stack flexDirection={'row'} gap={2} alignItems={'center'}>
              <CircularProgress
                determinate
                value={refreshCount}
                size="sm"
                thickness={4}
                color="primary"
              />
              <FaFile />
            </Stack>
          </DialogTitle>
          <Divider />
          <DialogContent
            sx={{
              overflowX: 'hidden',
            }}
          >
            <Stack
              gap={1}
              sx={(theme) => ({
                background: theme.palette.background.level1,
                padding: 2,
                borderRadius: 'sm',
                overflow: 'hidden',
              })}
            >
              {loading && backups.length === 0 && (
                <Stack alignItems={'center'} justifyContent={'center'}>
                  <l-line-wobble
                    size="80"
                    stroke="5"
                    bg-opacity="0.1"
                    speed="1.75"
                    color="white"
                  ></l-line-wobble>
                </Stack>
              )}
              {!loading && backups.length === 0 && (
                <Typography>No backup files found.</Typography>
              )}
              {backups.map((backup, index) => {
                const size =
                  sizes.find((size) => size.id === backup.routine.id)?.size ||
                  0;

                return (
                  <Sheet
                    key={index}
                    variant="outlined"
                    sx={(theme) => ({
                      display: 'flex',
                      gap: 1,
                      overflow: 'hidden',
                      background: theme.palette.background.surface,
                      borderRadius: 'sm',
                      flexDirection: 'column',
                      minHeight: 110,
                      maxHeight: 360,
                    })}
                  >
                    <Stack gap={1} flexGrow={1}>
                      <Stack
                        mt={2}
                        ml={2}
                        mr={2}
                        gap={1}
                        sx={{
                          flexDirection: {
                            xs: 'column',
                            sm: 'row',
                          },
                          justifyContent: {
                            xs: 'flex-start',
                            sm: 'space-between',
                          },
                          alignItems: {
                            xs: 'flex-start',
                            sm: 'center',
                          },
                        }}
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
                          {backup.routine.name}
                        </Chip>
                        <Chip
                          onClick={() => {
                            axios
                              .get(
                                `${apiUrl}/backup/open/${backup.routine.id}/backup`,
                                {
                                  headers: {
                                    Authorization:
                                      'Bearer ' +
                                      localStorage.getItem('loginToken'),
                                  },
                                }
                              )
                              .catch((error) => {
                                console.log(error);

                                toast.error(
                                  `Failed to open backup folder.`,
                                  toastOptions
                                );
                              });
                          }}
                          sx={{
                            '.MuiChip-action': {
                              opacity: 0,
                            },
                            minHeight: '36px',
                            maxHeight: '36px',
                            paddingTop: 0.1,
                            border: '2px solid rgb(189, 126, 126) !important',
                            display: {
                              xs: 'none',
                              md: 'flex',
                            },
                            flexDirection: 'row',
                            cursor: 'pointer',
                            '&:hover': {
                              background: 'rgb(189, 126, 126) !important',
                            },
                          }}
                          size="lg"
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
                              <FaHardDrive />
                            </Box>
                          }
                        >
                          {formatFileSize(size)}
                        </Chip>
                      </Stack>
                      <Divider
                        sx={{
                          mt: 1,
                          mb: 1,
                        }}
                      />
                      <Stack
                        sx={{
                          overflow: 'auto',
                          pb: 2,
                          maxHeight: 258,
                          '&::-webkit-scrollbar': {
                            width: 2,
                            height: 6,
                            borderRadius: 0,
                          },
                          '&::-webkit-scrollbar-track': {
                            background: (theme) => theme.palette.neutral[600],
                            borderRadius: 0,
                          },
                        }}
                      >
                        {backup?.files &&
                          backup.files?.children &&
                          renderFiles(backup.files, 0, backup.routine)}
                      </Stack>
                    </Stack>
                  </Sheet>
                );
              })}
            </Stack>
          </DialogContent>
          <DialogActions
            sx={{
              pt: 0,
            }}
          >
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
              Close
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </>
  );
}
