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
      getRootNotebooks: () => Promise<any>;
    }
  }
}
