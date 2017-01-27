const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain; //Взаимодействия бека с фронтом
const fs = require('fs'); //Файловая система
const appdata = app.getPath('userData') + '/'; //Папка для сохранения в локалке
const request = require('request'); //Запросы на файлы
const wincmd = require('node-windows'); //Чекаем процессы
const registry = require('winreg'); //Регистр
const {Tray, Menu} = require('electron');
const {webContents} = require('electron');
let tray = null;

const appSettingsDefault = JSON.stringify({
  autoCheck: {
    enabled: true,
    period: 60000,
  },
  playerProcess: 'PotPlayerMini',
});

var appSettings = {};

let mainWindow
let authWindow
let settingsWindow

function createWindow () {

  tray = new Tray(__dirname + '/logo.png')
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Развернуть', click:  function(){
           mainWindow.show();
       } },
       { label: 'Выйти', click:  function(){
           app.isQuiting = true;
           app.quit();

       } }
  ])
  tray.setToolTip('MScrobbler')
  tray.setContextMenu(contextMenu)

  tray.on('double-click', () => {
    mainWindow.show();
  })

  electron.protocol.registerStringProtocol('myshows', function (request, callback) {
    let code = request.url.substr(38);

    mainWindow.loadURL(`file://${__dirname}/app/app/index.html#!/auth/`+code);
    authWindow.destroy();

  }, function (err) {
    if (err) {
      throw err;
    }
  });

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,

    minWidth: 800,
    minHeight: 600,
    resizable: false,
    maximizable: false,

    show: false,
    title: 'Loading...',
    backgroundColor: '#e8e8e8',
    icon: 'logo.png'
  })

  // mainWindow.setMenu(null);
  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/app/app/index.html`)


  mainWindow.on('close', function (event) {
        if( !app.isQuiting){
            event.preventDefault()
            mainWindow.hide();
        }
        return false;
    });

  mainWindow.once('ready-to-show', () => {
    setTimeout(function() {
      mainWindow.show();
      // mainWindow.webContents.send('pushAppSettings', appSettings);
    }, 500);
  })

  mainWindow.setMenuBarVisibility(false);

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
    'node-integration': false,
    icon: 'logo.png' });

    authWindow.setMenu(null);

    authWindow.on('page-title-updated', function(event) {
      event.preventDefault();
    });

    authWindow.loadURL(link);
    authWindow.once('ready-to-show', () => {
      authWindow.show();
    })
}

ipcMain.on('createSettingsWindow', function(event, arg) {
   createSettingsWindow(arg);
});


function createSettingsWindow () {

  settingsWindow = new BrowserWindow({
    width: 300,
    height: 350,
    show: false,
    modal: true,
    skipTaskbar: false,
    resizable: false,
    title: 'Настройки',
    backgroundColor: '#e8e8e8',
    icon: 'logo.png' });

    // settingsWindow.setMenu(null);
    settingsWindow.setMenuBarVisibility(false);

    settingsWindow.on('page-title-updated', function(event) {
      event.preventDefault();
    });

    settingsWindow.loadURL(`file://${__dirname}/app/app/index.html#!/settings`);
    settingsWindow.once('ready-to-show', () => {
      setTimeout(function() {
        settingsWindow.show();
      }, 500);
    })
}


function saveFile (arg) {
  request.get({url: arg.fileLink, encoding: 'binary'}, function (err, response, body) {
    fs.writeFile(appdata + arg.fileName, body, 'binary', function(err) {
      if(err)
        throw err;
      else
        console.log("The file was saved!");
    });
  });
}

ipcMain.on('saveFile', function(event, arg) {
  saveFile(arg);
});

//---- Читаем настройки и загоняем в переменную, если отсутствуют записываем дефолтные ----//
try {
  appSettings = fs.readFileSync(appdata + 'settings.json',  'utf8');
} catch (err) {
  //---- Бросаем ошибку если это не отсутствие файла ----//
  if (err.code !== 'ENOENT') throw err;

  //---- Создаем новый, если отсутствует ----//
  fs.writeFile(appdata + 'settings.json', appSettingsDefault, (err) => {
    if (err) throw err;
    console.log('Default settings created!');
  });
  appSettings = appSettingsDefault;
}

//---- Возвращаем настройки в жисонъ ----//
appSettings = JSON.parse(appSettings);

//---- Получаем запрос для считывания настроек и отдаем ----//
ipcMain.on('getAppSettings', (event, arg = {}) => {
  event.sender.send('pushAppSettings', appSettings);
});

//---- Принимаем новые настройки с окна настроек и записываем в файл ----//
ipcMain.on('saveSettings', (event, arg = {}) => {
  mainWindow.webContents.send('refreshSettings', arg);
  appSettings = arg;
  fs.writeFile(appdata + 'settings.json', JSON.stringify(appSettings), (err) => {
    if (err) throw err;
    console.log('New settings recorded!');
  });
});


//---- Открытие консоли по клику ----//
ipcMain.on('toogleDevTools', (event, arg = {}) => {
  mainWindow.webContents.toggleDevTools();
});

//---- Детектим плеер для скробблерства и посылаем на фронт ответ ----//

// var playerProcessAnswer,
// playerProcessLastState = '',
// playerInfo = {};
//
// var serialNameRegExp = /([^\s]*s\d{1,4}.{0,1}e\d{1,4}[^\s]*)/;
// var otherVideoRegExp = /([^\s]*\.[^\s]*)/;
//
// ipcMain.on('PlayerProcess', function (event, arg = {}) {
//
//   if (arg == 'startTimer') sendPlayerEventByInterval(event);
//   else if (arg == 'stopTimer') sendPlayerEventByInterval('stop');
//   else if (arg == 'force') {
//     //Обнуляем последнее состояние
//     playerProcessLastState = '';
//     sendPlayerEvent(event);
//   }
//
//
// });
//
//
// function sendPlayerEvent (event) {
//
//   playerInfo.isSerial = false;
//
//   wincmd.list(function(svc){
//
//     var playerProcess = svc.find(({ImageName}) => ImageName === appSettings.playerProcess + '.exe');
//
//     if (playerProcess && playerProcess.WindowTitle.match(serialNameRegExp)) {
//       playerProcessAnswer = playerProcess.WindowTitle.match(serialNameRegExp)[1];
//       playerInfo.isSerial = true;
//     } else if (playerProcess && playerProcess.WindowTitle.match(otherVideoRegExp)) {
//       playerProcessAnswer = playerProcess.WindowTitle.match(otherVideoRegExp)[1];
//     } else playerProcessAnswer = 'Player hasn\'t started yet';
//
//     //---- Если состояние поменялось, отправляем на фронт и потом записываем новое состояние ----//
//     if (playerProcessAnswer !== playerProcessLastState) {
//       playerInfo.answer = playerProcessAnswer;
//       event.sender.send('PlayerProcess-callback', playerInfo);
//     };
//     playerProcessLastState = playerProcessAnswer;
//   },true);
// }
//
// var intervalUpdate;
//
// function sendPlayerEventByInterval(event) {
//   if (event == 'stop') {
//     clearInterval(intervalUpdate);
//     return
//   }
//   intervalUpdate = setInterval(function() {
//     sendPlayerEvent(event);
//   }, appSettings.autoCheck.period);
// }

//---- Windows Register with MPC ----//
ipcMain.on('mpcWebServerStatus', (event, arg = {}) => {
  var regKey = new registry({
    hive: registry.HKCU,
    key:  '\\Software\\MPC-HC\\MPC-HC\\Settings'
  });

  regKey.values(function (err, items /* array of RegistryItem */) {
    let isWebServerOn = items.find(({name}) => name === 'EnableWebServer'),
     webServerPort = items.find(({name}) => name === 'WebServerPort'),
     webServer = {
       isOn : parseInt(isWebServerOn.value),
       port : parseInt(webServerPort.value)
     };
    event.sender.send('mpcWebServerStatusFeedback', webServer);
  });
});
