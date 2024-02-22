import { TNewBackupSetting } from '@types';

export function validateNewBackupSetting(newSetting: TNewBackupSetting) {
  if (
    newSetting.enabled === undefined ||
    newSetting.name === undefined ||
    newSetting.path === undefined ||
    newSetting.frequency === undefined ||
    newSetting.limit === undefined
  ) {
    return false;
  }

  if (
    typeof newSetting.frequency !== 'number' ||
    isNaN(newSetting.frequency) ||
    typeof newSetting.limit !== 'number' ||
    isNaN(newSetting.limit)
  ) {
    return false;
  }

  if (newSetting.frequency < 1 || newSetting.limit < 1) {
    return false;
  }

  if (newSetting.name?.trim() === '' || newSetting.path?.trim() === '') {
    return false;
  }

  return true;
}
