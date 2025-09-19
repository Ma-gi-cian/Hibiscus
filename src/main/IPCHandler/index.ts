import {ipcMain} from 'electron';
import DatabaseManager from '../DatabaseManager';

class IpcHandler {

  private database : DatabaseManager;

  constructor(Idatabase : DatabaseManager) {
    this.database = Idatabase;
    this.setupHandler();
  }

  private setupHandler(){
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    ipcMain.handle('data', (_event, data : string) => {
      console.log("The data recieved is ", data);
      return "got the data";
    }),

    ipcMain.handle('sync', async() => {
      console.log("Got the order to sync")
      const response = await this.database.sync()
      console.log(response);
      return response;
    }),

    ipcMain.handle('add-notebook', async(_event, data) => {
      const {name, notebookName } = data;
      const response = await this.database.createNotebook(name, notebookName)
      return response;
    }),

    ipcMain.handle('getRootNotebooks', async() => {
      const response = await this.database.getRootNotebooks();
      console.log({"RootNotebooks" : response});
      return response;
    }),

    ipcMain.handle('getNotes', async(_event, notebookId : string) => {
      const response = await this.database.getNotes(notebookId);
      return response;
    }),

    ipcMain.handle('createNote', async(_event, notebookId) => {
      const response = await this.database.handleNote("Untitled", null, "", notebookId, 0, 0, "working");
      return response;
    }),

    ipcMain.handle('getNote', async(_event, id:string) => {
      const response = await this.database.getNoteData(id);
      return response;
    })
  }
}

export default IpcHandler;
