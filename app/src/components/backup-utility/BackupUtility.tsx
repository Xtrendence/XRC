import { Page } from '../common';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { apiUrl, toastOptions } from '../../globalVariables';
import type { TBackupRoutines, TNewBackupRoutine, TProcess } from '@types';
import { CreateBackupCard } from './CreateBackupCard';
import { BackupCard } from './BackupCard';
import toast from 'react-hot-toast';
import { validateNewBackupRoutine } from '../../utils';
import { Sheet, Stack, Switch, Tooltip, Typography } from '@mui/joy';
import ConfirmationModal from '../common/ConfirmationModal';
import { useTitle } from '../../hooks/useTitle';
import { useInterval } from '../../hooks/useInterval';

const initialNewRoutine: TNewBackupRoutine = {
  enabled: false,
  name: '',
  path: '',
  frequency: undefined,
  limit: undefined,
};

export default function BackupUtility() {
  useTitle('Backup Utility');

  const [routines, setRoutines] = useState<TBackupRoutines>([]);
  const [backupSizes, setBackupSizes] = useState<
    Array<{ id: string; size: number }>
  >([]);

  const [newRoutine, setNewRoutine] =
    useState<TNewBackupRoutine>(initialNewRoutine);

  const [routineToDelete, setRoutineToDelete] = useState<TNewBackupRoutine>();
  const [keepFiles, setKeepFiles] = useState(true);

  const getRoutines = () => {
    axios
      .get(`${apiUrl}/backup`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('loginToken'),
        },
      })
      .then((res) => {
        const data: TBackupRoutines = res.data.routines;
        setRoutines(data.sort((a, b) => a.name.localeCompare(b.name)));
        setBackupSizes(res.data.sizes);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCreate = () => {
    const valid = validateNewBackupRoutine(newRoutine, toast);

    if (!valid) {
      return;
    }

    axios
      .post(`${apiUrl}/backup`, newRoutine, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('loginToken'),
        },
      })
      .then((res) => {
        const data: TBackupRoutines = res.data.routines;
        setNewRoutine(initialNewRoutine);
        setRoutines(data.sort((a, b) => a.name.localeCompare(b.name)));
        toast.success('Backup routine created successfully.', toastOptions);
      })
      .catch((error) => {
        console.log(error);

        if (error?.response?.data?.message) {
          toast.error(error.response.data.message, toastOptions);
          return;
        }

        toast.error(
          'Could not create backup routine. Please try again and make sure all fields are filled out and the correct type.',
          toastOptions
        );
      });
  };

  const handleUpdate = (changes: TNewBackupRoutine) => {
    const valid = validateNewBackupRoutine(changes, toast);

    if (!valid) {
      return;
    }

    axios
      .put(`${apiUrl}/backup/${changes.id}`, changes, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('loginToken'),
        },
      })
      .then((res) => {
        const data: TBackupRoutines = res.data.routines;
        setRoutines(data.sort((a, b) => a.name.localeCompare(b.name)));
        toast.success('Backup routine updated successfully.', toastOptions);
      })
      .catch((error) => {
        console.log(error);

        if (error?.response?.data?.message) {
          toast.error(error.response.data.message, toastOptions);
          return;
        }

        toast.error(
          'Could not update backup routine. Please try again and make sure all fields are filled out and the correct type.',
          toastOptions
        );
      });
  };

  useEffect(() => {
    getRoutines();
  }, []);

  const [processes, setProcesses] = useState<Array<TProcess>>([]);
  const [checksum, setChecksum] = useState<string>('');

  const processOptions = useMemo(() => {
    const result: Array<{
      label: string;
      id: number;
    }> = [];

    processes.forEach((process, index) => {
      if (!result.some((p) => p.label === process.name)) {
        result.push({ label: process.name, id: index });
      }
    });

    return result;
  }, [processes]);

  const fetchProcesses = async () => {
    axios
      .get(`${apiUrl}/processes?checksum=${checksum}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('loginToken'),
        },
      })
      .then((response) => {
        const { data } = response;

        if (data.changed === true) {
          setProcesses(data.processes);
          setChecksum(data.checksum);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useInterval(fetchProcesses, 5000, {
    immediate: true,
    initialDelay: 10,
  });

  return (
    <Page>
      <ConfirmationModal
        title="Delete Backup Routine"
        content={`Are you sure you want to delete the "${routineToDelete?.name}" backup routine?`}
        open={routineToDelete !== undefined}
        setOpen={(value) => {
          if (!value) {
            setRoutineToDelete(undefined);
            setKeepFiles(true);
          }
        }}
        onConfirm={() => {
          if (routineToDelete) {
            axios
              .delete(`${apiUrl}/backup/${routineToDelete.id}`, {
                headers: {
                  Authorization: 'Bearer ' + localStorage.getItem('loginToken'),
                },
                data: {
                  keepFiles,
                },
              })
              .then(() => {
                getRoutines();
              })
              .catch((error) => {
                toast.error('Failed to delete backup routine.', toastOptions);
                console.log(error);
              });
          }

          setRoutineToDelete(undefined);
          setKeepFiles(true);
        }}
        actions={
          <Stack flexGrow={1}>
            <Tooltip
              arrow
              placement="bottom-start"
              variant="soft"
              sx={{
                maxWidth: 300,
              }}
              title="You may opt to keep the files that have already been backed up. If you choose to keep the files, they will not be deleted when the backup routine is deleted. If you choose not to keep the files, they will be deleted along with the backup routine."
            >
              <Sheet
                variant="soft"
                sx={{
                  minWidth: 170,
                  maxWidth: 170,
                  gap: 2,
                  borderRadius: 'sm',
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
                  Keep Files
                </Typography>
                <Switch
                  size="lg"
                  color={keepFiles ? 'success' : 'danger'}
                  checked={keepFiles}
                  onChange={(e) => {
                    setKeepFiles(e.target.checked);
                  }}
                />
              </Sheet>
            </Tooltip>
          </Stack>
        }
        danger
      />
      <Stack gap={2}>
        <CreateBackupCard
          processOptions={processOptions}
          newRoutine={newRoutine}
          setNewRoutine={setNewRoutine}
          onCreate={handleCreate}
        />
        {routines.map((routine) => (
          <BackupCard
            key={routine.id}
            processOptions={processOptions}
            routine={routine}
            onUpdate={handleUpdate}
            setRoutineToDelete={setRoutineToDelete}
            backupSize={backupSizes.find((s) => s.id === routine.id)?.size || 0}
          />
        ))}
      </Stack>
    </Page>
  );
}
