export type TBackupSetting = {
  id: string;
  enabled: boolean;
  name: string;
  path: string;
  frequency: number;
  limit: number;
  type: 'folder' | 'file';
};

export type TBackupSettings = Array<TBackupSetting>;

export type TNewBackupSetting = {
  id?: string;
  enabled?: boolean;
  name?: string;
  path?: string;
  frequency?: number;
  limit?: number;
  type?: 'folder' | 'file';
};
