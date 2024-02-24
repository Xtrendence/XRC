export type TBackupRoutine = {
  id: string;
  enabled: boolean;
  name: string;
  path: string;
  frequency: number;
  limit: number;
  type: 'folder' | 'file';
};

export type TBackupRoutines = Array<TBackupRoutine>;

export type TNewBackupRoutine = {
  id?: string;
  enabled?: boolean;
  name?: string;
  path?: string;
  frequency?: number;
  limit?: number;
  type?: 'folder' | 'file';
};
