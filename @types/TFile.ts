export type TFile = {
  type: 'folder' | 'file';
  path: string;
  defaultContent?: string;
};

export type TFiles = Record<string, TFile>;
