import {ipcMain} from 'electron';

class IpcHandler {
  constructor() {
    this.setupHandler();
  }

  private setupHandler(){
    ipcMain.handle('data', (_event, data : string) => {
      console.log("The data recieved is ", data);
      return "got the data";
    })
  }
}

export default IpcHandler;
