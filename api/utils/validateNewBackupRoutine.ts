import { TNewBackupRoutine } from '@types';

export function validateNewBackupRoutine(newRoutine: TNewBackupRoutine) {
  if (
    newRoutine.enabled === undefined ||
    newRoutine.name === undefined ||
    newRoutine.path === undefined ||
    newRoutine.frequency === undefined ||
    newRoutine.limit === undefined
  ) {
    return false;
  }

  if (
    typeof newRoutine.frequency !== 'number' ||
    isNaN(newRoutine.frequency) ||
    typeof newRoutine.limit !== 'number' ||
    isNaN(newRoutine.limit)
  ) {
    return false;
  }

  if (newRoutine.frequency < 1 || newRoutine.limit < 1) {
    return false;
  }

  if (newRoutine.name?.trim() === '' || newRoutine.path?.trim() === '') {
    return false;
  }

  return true;
}
