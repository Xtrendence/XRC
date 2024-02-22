import { Card } from '@mui/joy';
import { TNewBackupSetting } from '@types';
import { Dispatch, SetStateAction } from 'react';
import { BackupCardForm } from './BackupCardForm';

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
      <BackupCardForm
        type="create"
        newSetting={newSetting}
        setNewSetting={setNewSetting}
        onConfirm={onCreate}
      />
    </Card>
  );
}
