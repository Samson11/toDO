const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')
const {Menu,ipcMain} = electron
let mainWindow
let addWindow
const ipc = electron.ipcMain
const Tray = electron.Tray
let appIcon = null


function createWindow () {
  mainWindow = new BrowserWindow({width: 500, height: 400})

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.on('closed',function(){
      app.quit()
  })

  const mainMenu = Menu.buildFromTemplate(menu)
  Menu.setApplicationMenu(mainMenu)
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

function createNewWindow(){
    addWindow = new BrowserWindow({
        width:400,
        height:400,
        title:'Add Item'
    })
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname,'addWindow.html'),
        protocol:'file:',
        slashes:true
    }))

    //Garbage Collection
    addWindow.on('close',function () {
        addWindow = null
    })
}

ipcMain.on('item:add',function(e,item){
    console.log(item)
    mainWindow.webContents.send('item:add',item)
    addWindow.close()
})

const menu = [
    {
    label:'toDO',
    submenu:[
    {label:'Add toDO',click(){
        createNewWindow()
    }},
    {label:'Clear toDO',click(){
        mainWindow.webContents.send('item:clear')
    }},
    {label:'Quit toDO',
    accelerator: process.platform =='darwin' ? 'Command+Q' :'Ctrl+Q'
    ,click(){
        app.quit()
    }}
]},
{
    label: 'Edit',
    submenu: [{
      label: 'Undo',
      accelerator: 'CmdOrCtrl+Z',
      role: 'undo'
    }, {
      label: 'Redo',
      accelerator: 'Shift+CmdOrCtrl+Z',
      role: 'redo'
    }, {
      type: 'separator'
    }, {
      label: 'Cut',
      accelerator: 'CmdOrCtrl+X',
      role: 'cut'
    }, {
      label: 'Copy',
      accelerator: 'CmdOrCtrl+C',
      role: 'copy'
    }, {
      label: 'Paste',
      accelerator: 'CmdOrCtrl+V',
      role: 'paste'
    }, {
      label: 'Select All',
      accelerator: 'CmdOrCtrl+A',
      role: 'selectall'
    }]
  },
  
{label:'About',
click: function (item, focusedWindow) {
  if (focusedWindow) {
    const options = {
      type: 'info',
      title: 'toDO',
      buttons: ['Ok'],
      message: 'This app was written by Samson Udo.'
    }
    electron.dialog.showMessageBox(focusedWindow, options, function () {})
  }
}},
{
    label: 'Window',
    role: 'window',
    submenu: [{
    label: 'Toggle Full Screen',
    accelerator: (function () {
      if (process.platform === 'darwin') {
        return 'Ctrl+Command+F'
      } else {
        return 'F11'
      }
    })(),
    click: function (item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
      }
    }
  },,
	{
      label: 'Minimize',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    }, {
      label: 'Close',
      accelerator: 'CmdOrCtrl+W',
      role: 'close'
    }, {
      type: 'separator'
    }, {
      label: 'Reopen Window',
      accelerator: 'CmdOrCtrl+Shift+T',
      enabled: false,
      key: 'reopenMenuItem',
      click: function () {
        app.emit('activate')
      }
    }]
  }, {
    label: 'Help',
    role: 'help',
    submenu: [{
      label: 'Learn More',
      click: function () {
        electron.shell.openExternal('http://electron.atom.io')
      }
    }]
  }];

//If I am running on a Mac OS X...
if (process.platform == 'darwin'){
    menu.unshift({})
}

if(process.env.NODE_ENV !=='production'){
    menu.push({
        label:'Dev Tools',
        submenu:[{
            label:'Toggle Dev Tools',
            accelerator:process.platform == 'darwin' ? 'Command+I' :'Ctrl+I',
            click(item,focusedWindow){
                focusedWindow.toggleDevTools()
            }
        },
        {role:'reload'}]
    })
}