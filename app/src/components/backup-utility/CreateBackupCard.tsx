import { Card } from '@mui/joy';
import { TNewBackupRoutine } from '@types';
import { Dispatch, SetStateAction } from 'react';
import { BackupCardForm } from './BackupCardForm';

export function CreateBackupCard({
  processOptions,
  newRoutine,
  setNewRoutine,
  onCreate,
}: {
  processOptions?: Array<{
    label: string;
    id: number;
  }>;
  newRoutine?: TNewBackupRoutine;
  setNewRoutine: Dispatch<SetStateAction<TNewBackupRoutine>>;
  onCreate: () => void;
}) {
  return (
    <Card>
      <BackupCardForm
        processOptions={processOptions || []}
        type="create"
        newRoutine={newRoutine}
        setNewRoutine={setNewRoutine}
        onConfirm={onCreate}
      />
    </Card>
  );
}
