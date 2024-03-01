import { TBackupRoutine } from './TBackupRoutine';

export interface DirectoryTree<
  C extends Record<string, any> = Record<string, any>
> {
  path: string;
  name: string;
  size: number;
  type: 'directory' | 'file';
  children?: DirectoryTree<C>[];
  extension?: string;
  isSymbolicLink?: boolean;
  custom: C;
}

export type TBackupFiles = Array<{
  routine: TBackupRoutine;
  files: DirectoryTree;
}>;
