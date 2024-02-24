import { Card } from '@mui/joy';
import { TNewBackupRoutine } from '@types';
import { Dispatch, SetStateAction } from 'react';
import { BackupCardForm } from './BackupCardForm';

export function CreateBackupCard({
  newRoutine,
  setNewRoutine,
  onCreate,
}: {
  newRoutine?: TNewBackupRoutine;
  setNewRoutine: Dispatch<SetStateAction<TNewBackupRoutine>>;
  onCreate: () => void;
}) {
  return (
    <Card>
      <BackupCardForm
        type="create"
        newRoutine={newRoutine}
        setNewRoutine={setNewRoutine}
        onConfirm={onCreate}
      />
    </Card>
  );
}
