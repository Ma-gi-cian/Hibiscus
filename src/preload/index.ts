import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { USER } from '../utils/types';

/**
 * `on` => one way messgae handler, the main can reply but will need to use event.reply() and it is not asynchronous
 * `invoke` => two way message handler, the main can reply via the return statement, this is asnychronous in nature will need to use async/await in the renderer to get the response - good stuff
 */


// Custom APIs for renderer
const api = {
  talk: () => {
    return ipcRenderer.invoke('data', "mathematics")
  },

  sync: async () => {
    const response = await ipcRenderer.invoke('sync');
    console.log("The response of this method is", response);
    return response;
  },

  addNotebook: async(name, parentNotebook) => {
    const response = await ipcRenderer.invoke('add-notebook', {name, parentNotebook});
    return response;
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
