export type TBackupSetting = {
  id: string;
  enabled: boolean;
  name: string;
  path: string;
  frequency: number;
  limit: number;
};

export type TBackupSettings = Array<TBackupSetting>;
