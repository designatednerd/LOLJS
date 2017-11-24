const { 
  app, BrowserWindow, ipcMain,
  Menu, Tray, dialog
} = require('electron');

const url = require('url');
const fs = require('fs');
const path = require('path');

// import server.js
const { Server } = require('./server');
const serverPort = 9000;

//
//  App
//
let mainWindow;

// create and show main window on app start
app.on('ready', () => {
  mainWindow = createMainWindow();
});

//
//  Window
//
function createMainWindow() {
    // setup the window
    let window = new BrowserWindow({
      width: 600, height: 350,
      backgroundColor: '#efefef',
      show: false
    })
  
    // html file to open in window
    const startUrl = process.env.ELECTRON_START_URL || url.format({
      pathname: path.join(__dirname, '../build/index.html'),
      protocol: 'file:',
      slashes: true
    });
    window.loadURL(startUrl);
  
    // once loaded html, send a route command
    window.once('ready-to-show', () => {
      mainWindow.show();
    });
    
    return window;
}

//
//  Server
//
let srv = new Server(serverPort, (logEntry) => {
  mainWindow.webContents.send('log', logEntry);
});
srv.addPath('users', [{id: 1, name: 'John'}, {id: 2, name: 'Peter'}]);
