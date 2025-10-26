
export interface Episode {
  id: string;
  title: string;
}

export interface CueSheetReport {
  title: string;
  markdown: string;
}

export interface FileData {
  base64: string;
  mimeType: string;
  name: string;
}

export enum ProcessStep {
  IDLE = 'IDLE',
  FETCHING_EPISODES = 'FETCHING_EPISODES',
  EPISODE_SELECTED = 'EPISODE_SELECTED',
  UPDATING_GSHEET = 'UPDATING_GSHEET',
  UPLOADING_FILES = 'UPLOADING_FILES',
  GENERATING_REPORT = 'GENERATING_REPORT',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}
