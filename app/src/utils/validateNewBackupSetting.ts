import { toast } from 'react-hot-toast';
import { toastOptions } from '../globalVariables';
import { TNewBackupSetting } from '@types';

type TToast = typeof toast;

export function validateNewBackupSetting(
  newSetting: TNewBackupSetting,
  toast: TToast
) {
  if (
    newSetting.enabled === undefined ||
    newSetting.name === undefined ||
    newSetting.path === undefined ||
    newSetting.frequency === undefined ||
    newSetting.limit === undefined
  ) {
    toast.error('All fields must be filled out.', toastOptions);
    return false;
  }

  if (
    typeof newSetting.frequency !== 'number' ||
    isNaN(newSetting.frequency) ||
    typeof newSetting.limit !== 'number' ||
    isNaN(newSetting.limit)
  ) {
    toast.error('Frequency and limit must be numbers.', toastOptions);
    return false;
  }

  if (newSetting.frequency < 1 || newSetting.limit < 1) {
    toast.error('Frequency and limit must be positive numbers.', toastOptions);
    return false;
  }

  if (newSetting.name?.trim() === '' || newSetting.path?.trim() === '') {
    toast.error('Name and path cannot be empty.', toastOptions);
    return false;
  }

  return true;
}
