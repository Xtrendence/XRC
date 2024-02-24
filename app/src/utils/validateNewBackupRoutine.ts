import { toast } from 'react-hot-toast';
import { toastOptions } from '../globalVariables';
import { TNewBackupRoutine } from '@types';

type TToast = typeof toast;

export function validateNewBackupRoutine(
  newRoutine: TNewBackupRoutine,
  toast: TToast
) {
  if (
    newRoutine.enabled === undefined ||
    newRoutine.name === undefined ||
    newRoutine.path === undefined ||
    newRoutine.frequency === undefined ||
    newRoutine.limit === undefined
  ) {
    toast.error('All fields must be filled out.', toastOptions);
    return false;
  }

  if (
    typeof newRoutine.frequency !== 'number' ||
    isNaN(newRoutine.frequency) ||
    typeof newRoutine.limit !== 'number' ||
    isNaN(newRoutine.limit)
  ) {
    toast.error('Frequency and limit must be numbers.', toastOptions);
    return false;
  }

  if (newRoutine.frequency < 1 || newRoutine.limit < 1) {
    toast.error('Frequency and limit must be positive numbers.', toastOptions);
    return false;
  }

  if (newRoutine.name?.trim() === '' || newRoutine.path?.trim() === '') {
    toast.error('Name and path cannot be empty.', toastOptions);
    return false;
  }

  return true;
}
