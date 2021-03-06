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
let tray; 

// create and show main window on app start
app.on('ready', () => {
  mainWindow = createMainWindow();
});

function createTray() {
  const iconPath = path.join(__dirname, './tray-icon.png')  
  tray = new Tray(iconPath);
  tray.setToolTip("LOLJS")  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show window...", 
      click: () => {
        // Display the window
        showWindow()       
      }
    },
    {
      label: "Quit",
      role: 'quit'
    }
  ])
  tray.setContextMenu(contextMenu)
}

//
//  Window
//

function showWindow() {
  app.dock.show()
  mainWindow.show()

  setTimeout(() => { tray.destroy(); tray = null; }, 500) //MS
}


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

    ipcMain.on('get-server-address', (event) => {
      event.sender.send('server-address', 'http://localhost:' + serverPort)
    })   

    ipcMain.on('open-file', (event) => {
      const dialogOptions = {
        title: 'Select JSON File',
        properties: ['openFile'],
        filters: [{ 
          name: "JSON", 
          extensions: ['json'],
        }]
      };

      dialog.showOpenDialog(mainWindow, dialogOptions, (filePaths) => {
        if (!filePaths) return; 
        const filePath = filePaths[0];

        fs.readFile(filePath, 'utf8', (error, json) => {
          let endPoint = path.basename(filePath, '.json')
          srv.addPath(endPoint, JSON.parse(json))
        })
      })
    })
    

    ipcMain.on('send-to-tray', (event) => {
      app.dock.hide()
      mainWindow.hide()
      createTray()
    })

    return window;
}

//
//  Server
//
let srv = new Server(serverPort, (logEntry) => {
  mainWindow.webContents.send('log', logEntry);
});
srv.addPath('users', [{id: 1, name: 'John'}, {id: 2, name: 'Peter'}]);
