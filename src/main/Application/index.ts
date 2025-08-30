import {app, BrowserWindow} from 'electron';
import {join} from 'path';
import {electronApp, optimizer, is} from '@electron-toolkit/utils';
import IpcHandler from '../IPCHandler';
import DatabaseManager from '../DatabaseManager';


class Application {

  private static instance: Application;
  private mainWindow: BrowserWindow ;
  private ipcHandler: IpcHandler;
  private database : DatabaseManager

  constructor(){
    this.database = new DatabaseManager();
    this.ipcHandler = new IpcHandler(this.database);
  }

  public getMainWindow(): BrowserWindow  {
    return this.mainWindow;
  }

  public createWindow() : void {
    let height = Math.round(27 * 1.55);
    this.mainWindow = new BrowserWindow({
      titleBarStyle: "hidden",
      titleBarOverlay: {
        color: '#f8f5f900',
        symbolColor: '#000000',
        height: height,
      },
      title: "Hibiscus",
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false
      }
    })

    this.mainWindow.on('ready-to-show', () => {
      this.mainWindow.show();
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']){
      this.mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
      this.mainWindow.loadFile(join(__dirname, '../../renderer/index.html'))
    }

    this.mainWindow.webContents.openDevTools();
  }

  public initialize(): void {


    app.on("ready", () => {
      this.createWindow();
    });

    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
        app.quit();
      }
    });

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createWindow();
      }
    });

    app.on("will-quit", () => {
      // At quitting un-register all the keybindings
    });
  }



}

export default Application;
