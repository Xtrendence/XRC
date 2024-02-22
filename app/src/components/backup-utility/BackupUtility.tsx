import { Page } from '../common';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiUrl, toastOptions } from '../../globalVariables';
import type { TBackupSettings, TNewBackupSetting } from '@types';
import { CreateBackupCard } from './CreateBackupCard';
import { BackupCard } from './BackupCard';
import toast from 'react-hot-toast';
import { validateNewBackupSetting } from '../../utils';
import { Stack } from '@mui/joy';
import ConfirmationModal from '../common/ConfirmationModal';
import { useTitle } from '../../hooks/useTitle';

export default function BackupUtility() {
  useTitle('Backup Utility');

  const [settings, setSettings] = useState<TBackupSettings>([]);

  const [newSetting, setNewSetting] = useState<TNewBackupSetting>({
    enabled: false,
    name: '',
    path: '',
    frequency: undefined,
    limit: undefined,
  });

  const [settingToDelete, setSettingToDelete] = useState<TNewBackupSetting>();

  const getSettings = () => {
    axios
      .get(`${apiUrl}/backup`)
      .then((res) => {
        setSettings(res.data.settings);
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

    // axios
    //   .post(`${apiUrl}/backup`, newSetting)
    //   .then((res) => {
    //     setSettings(res.data.settings);
    //     toast.success('Backup setting created successfully.', toastOptions);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     toast.error(
    //       'Could not create backup setting. Please try again and make sure all fields are filled out and the correct type.',
    //       toastOptions
    //     );
    //   });
  };

  const handleUpdate = (changes: TNewBackupSetting) => {
    console.log(changes);
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
          }
        }}
        onConfirm={() => {
          if (settingToDelete) {
            axios
              .delete(`${apiUrl}/backup/${settingToDelete.id}`)
              .then(() => {
                getSettings();
              })
              .catch((error) => {
                toast.error('Failed to delete backup routine.', toastOptions);
                console.log(error);
              });
          }
        }}
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
