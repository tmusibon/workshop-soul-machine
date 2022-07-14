const electron = require('electron');
const { app, BrowserWindow, globalShortcut } = require('electron')
const { isDev } = require('electron-is-dev');
require('dotenv').config();

const path = require('path');
const url = require('url');

let mainWindow;

function createWindow() {

    mainWindow = new BrowserWindow({
      kiosk: true,
      frame: false,
    });

    mainWindow.maximize();

    mainWindow.loadURL("https://b42-ui.orch-server-02478eb22e2d6d054cd5729f743d954c-0000.us-south.containers.appdomain.cloud/");
  }

// SSL/TSL: this is the self signed certificate support
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    event.preventDefault();
    callback(true);
});

// keyboard shortcut for exiting, may be customized to any key combination
app.whenReady().then(() => {
  globalShortcut.register('CommandOrControl+d+f+w+8+7+2', () => {
    app.quit();
  })

  globalShortcut.register('CommandOrControl+Shift+I', () => {
    mainWindow.webContents.toggleDevTools();
  })

}).then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});