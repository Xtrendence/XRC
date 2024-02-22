import { Page } from '../common';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../../globalVariables';
import type { TBackupSetting, TBackupSettings } from '@types';
import { CreateBackupCard, TNewBackupSetting } from './CreateBackupCard';
import { BackupCard } from './BackupCard';

export default function BackupUtility() {
  const [settings, setSettings] = useState<TBackupSettings>([]);

  const [newSetting, setNewSetting] = useState<TNewBackupSetting>({
    enabled: false,
    name: '',
    path: '',
    frequency: undefined,
    limit: undefined,
  });

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
    console.log(newSetting);
  };

  const handleUpdate = (changes: TBackupSetting) => {
    console.log(newSetting);
  };

  useEffect(() => {
    getSettings();
  }, []);

  return (
    <Page>
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
        />
      ))}
    </Page>
  );
}
