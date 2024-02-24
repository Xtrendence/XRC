import { Page } from '../common';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiUrl, toastOptions } from '../../globalVariables';
import type { TBackupSettings, TNewBackupSetting } from '@types';
import { CreateBackupCard } from './CreateBackupCard';
import { BackupCard } from './BackupCard';
import toast from 'react-hot-toast';
import { validateNewBackupSetting } from '../../utils';
import { Sheet, Stack, Switch, Tooltip, Typography } from '@mui/joy';
import ConfirmationModal from '../common/ConfirmationModal';
import { useTitle } from '../../hooks/useTitle';

const initialNewSetting: TNewBackupSetting = {
  enabled: false,
  name: '',
  path: '',
  frequency: undefined,
  limit: undefined,
};

export default function BackupUtility() {
  useTitle('Backup Utility');

  const [settings, setSettings] = useState<TBackupSettings>([]);

  const [newSetting, setNewSetting] =
    useState<TNewBackupSetting>(initialNewSetting);

  const [settingToDelete, setSettingToDelete] = useState<TNewBackupSetting>();
  const [keepFiles, setKeepFiles] = useState(true);

  const getSettings = () => {
    axios
      .get(`${apiUrl}/backup`)
      .then((res) => {
        const data: TBackupSettings = res.data.settings;
        setSettings(data.sort((a, b) => a.name.localeCompare(b.name)));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCreate = () => {
    const valid = validateNewBackupSetting(newSetting, toast);

    if (!valid) {
      return;
    }

    axios
      .post(`${apiUrl}/backup`, newSetting)
      .then((res) => {
        const data: TBackupSettings = res.data.settings;
        setNewSetting(initialNewSetting);
        setSettings(data.sort((a, b) => a.name.localeCompare(b.name)));
        toast.success('Backup setting created successfully.', toastOptions);
      })
      .catch((error) => {
        console.log(error);

        if (error?.response?.data?.message) {
          toast.error(error.response.data.message, toastOptions);
          return;
        }

        toast.error(
          'Could not create backup setting. Please try again and make sure all fields are filled out and the correct type.',
          toastOptions
        );
      });
  };

  const handleUpdate = (changes: TNewBackupSetting) => {
    const valid = validateNewBackupSetting(changes, toast);

    if (!valid) {
      return;
    }

    axios
      .put(`${apiUrl}/backup/${changes.id}`, changes)
      .then((res) => {
        const data: TBackupSettings = res.data.settings;
        setSettings(data.sort((a, b) => a.name.localeCompare(b.name)));
        toast.success('Backup setting updated successfully.', toastOptions);
      })
      .catch((error) => {
        console.log(error);

        if (error?.response?.data?.message) {
          toast.error(error.response.data.message, toastOptions);
          return;
        }

        toast.error(
          'Could not update backup setting. Please try again and make sure all fields are filled out and the correct type.',
          toastOptions
        );
      });
  };

  useEffect(() => {
    getSettings();
  }, []);

  return (
    <Page>
      <ConfirmationModal
        title="Delete Backup Routine"
        content={`Are you sure you want to delete the "${settingToDelete?.name}" backup routine?`}
        open={settingToDelete !== undefined}
        setOpen={(value) => {
          if (!value) {
            setSettingToDelete(undefined);
            setKeepFiles(true);
          }
        }}
        onConfirm={() => {
          if (settingToDelete) {
            axios
              .delete(`${apiUrl}/backup/${settingToDelete.id}`, {
                data: {
                  keepFiles,
                },
              })
              .then(() => {
                getSettings();
              })
              .catch((error) => {
                toast.error('Failed to delete backup routine.', toastOptions);
                console.log(error);
              });
          }

          setSettingToDelete(undefined);
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
          newSetting={newSetting}
          setNewSetting={setNewSetting}
          onCreate={handleCreate}
        />
        {settings.map((setting) => (
          <BackupCard
            key={setting.id}
            setting={setting}
            onUpdate={handleUpdate}
            setSettingToDelete={setSettingToDelete}
          />
        ))}
      </Stack>
    </Page>
  );
}
