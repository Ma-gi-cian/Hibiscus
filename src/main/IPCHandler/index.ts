import {ipcMain} from 'electron';
import DatabaseManager from '../DatabaseManager';

class IpcHandler {

  private database : DatabaseManager;

  constructor(Idatabase : DatabaseManager) {
    this.database = Idatabase;
    this.setupHandler();
  }

  private setupHandler(){
    ipcMain.handle('data', (_event, data : string) => {
      console.log("The data recieved is ", data);
      return "got the data";
    }),

    ipcMain.handle('sync', async() => {
      console.log("Got the order to sync")
      const response = await this.database.sync()
      console.log(response);
      return response;
    })
  }
}

export default IpcHandler;
