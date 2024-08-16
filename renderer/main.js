const fs = require('fs');
const path = require('path');
const {spawn} = require('child_process');
const {app, BrowserWindow, Menu, dialog, ipcMain} = require('electron');
const configPath = path.join(__dirname, '../data/config.json');
let config = {};

ipcMain.handle('load-theme', async (event) => {
  return config.theme;
});

try {
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch (error) {
  console.error('Error loading configuration files:', error);
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('renderer/index.html').then(_ => {
  });
}

app.whenReady().then(() => {
  createWindow();

  const menu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {
          label: 'Open',
          accelerator: config.keyBindings.open,
          click: () => {
            openFile();
          }
        },
        {
          label: 'Save',
          accelerator: config.keyBindings.save,
          click: () => {
            saveFile();
          }
        },
        {
          label: 'Open Terminal',
          accelerator: config.keyBindings.openTerminal,
          click: () => {
            openTerminal();
          }
        },
        {type: 'separator'},
        {role: 'quit'}
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {role: 'undo'},
        {role: 'redo'},
        {type: 'separator'},
        {role: 'cut'},
        {role: 'copy'},
        {role: 'paste'},
        {role: 'selectall'}
      ]
    },
    {
      label: 'Window',
      submenu: []
    }
  ]);

  Menu.setApplicationMenu(menu);
});

function openFile() {
  dialog.showOpenDialog({
    properties: ['openFile']
  }).then(result => {
    if (!result.canceled) {
      const filePath = result.filePaths[0];
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading file:', err);
        } else {
          document.querySelector('textarea').value = data;
        }
      });
    }
  }).catch(err => {
    console.error(err);
  });
}

function saveFile() {
  dialog.showSaveDialog({
    title: 'Save File',
    defaultPath: 'foo.txt',
    buttonLabel: 'Save'
  }).then(result => {
    if (!result.canceled) {
      const filePath = result.filePath;
      fs.writeFile(filePath, document.querySelector('textarea').value, (err) => {
        if (err) {
          console.error('Error saving file:', err);
        }
      });
    }
  }).catch(err => {
    console.error(err);
  });
}

function openTerminal() {
  const terminal = process.platform === 'win32' ? 'cmd.exe' : process.platform === 'darwin' ? 'open -a Terminal' : 'gnome-terminal';
  spawn(terminal, {shell: true, detached: true});
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
