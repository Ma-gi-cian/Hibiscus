import { ElectronAPI } from '@electron-toolkit/preload'
import {USER} from '../../utils/types';

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      hello : () => void;
      talk: () => Promise<string>;
      sync : () => Promise<USER>;
      addNotebook : (name: string, parentNotebook: string | null) => Promise<boolean>;
      getRootNotebooks: () => Promise<unkown>;
      getNotes : (notebookId: string) => Promise<unknown>;
      createNote : (notebookId: string) => Promise<Note | boolean>;
      getNoteData : (noteId: string) => Promise<Note | boolean>;
    }
  }
}
