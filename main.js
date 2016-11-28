const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const ipcMain = electron.ipcMain;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let authWindow

function createWindow () {

  electron.protocol.registerStringProtocol('myshows', function (request, callback) {
    let code = request.url.substr(38);

    mainWindow.loadURL(`file://${__dirname}/app/app/index.html#!/auth/`+code);
    authWindow.close();

  }, function (err) {
    if (!err) {
      console.log('Registered protocol succesfully');
    }
  });

  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600, show: false, title: 'Loading...', backgroundColor: '#e8e8e8'})

  // mainWindow.setMenu(null);
  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/app/app/index.html`)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  mainWindow.once('ready-to-show', () => {
    setTimeout(function() {
      mainWindow.show();
    }, 500);
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)


// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('createAuthWindow', function(event, arg) {
   createAuthWindow(arg);
});

function createAuthWindow (link) {

  authWindow = new BrowserWindow({
    width: 600,
    height: 650,
    show: false,
    modal: true,
    skipTaskbar: false,
    resizable: false,
    title: 'Авторизация',
    backgroundColor: '#000',
    'node-integration': false, });

    authWindow.setMenu(null);

    authWindow.on('page-title-updated', function(event) {
      event.preventDefault();
    });

    authWindow.loadURL(link);
    authWindow.once('ready-to-show', () => {
      authWindow.show()
    })
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
