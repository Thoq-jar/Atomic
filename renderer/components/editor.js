const fs = require('fs');
const path = require('path');
const hljs = require('highlight.js');
const {remote} = require("electron");
const {ipcRenderer} = require('electron');

const configPath = path.join(__dirname, '../data/config.json');
const themePath = path.join(__dirname, '../data');

let config = {};
let theme = {};

try {
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  theme = JSON.parse(fs.readFileSync(themePath, 'utf8'));
} catch (error) {
  console.error('Error loading configuration files:', error);
}

function Editor() {
  const editor = document.createElement('textarea');
  editor.style.width = '100%';
  editor.style.height = '100%';
  editor.style.border = 'none';
  editor.style.resize = 'none';
  editor.style.fontSize = `${config.fontSize}px`;
  editor.style.lineHeight = theme.lineHeight || config.lineHeight;
  editor.style.padding = '10px';
  editor.style.backgroundColor = theme.backgroundColor || '#282c34';
  editor.style.color = theme.textColor || '#ffffff';
  editor.style.fontFamily = theme.fontFamily || 'monospace';
  editor.style.tabSize = config.tabWidth || 4;
  editor.style.MozTabSize = config.tabWidth || 4;

  editor.addEventListener('input', function () {
    const code = this.value;
    document.getElementById('highlighted').innerHTML = hljs.highlightAuto(code).value;
  });

  editor.addEventListener('keydown', function (event) {
    const start = this.selectionStart;
    const end = this.selectionEnd;

    switch (event.key) {
      case 'Tab':
        event.preventDefault();
        this.value = this.value.substring(0, start) + ' '.repeat(config.tabWidth) + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + config.tabWidth;
        break;

      case 'Enter':
        event.preventDefault();
        const currentLine = this.value.substring(0, start).split('\n').pop();
        const indentation = currentLine.match(/^\s*/)[0];
        this.value = this.value.substring(0, start) + '\n' + indentation + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + indentation.length + 1;
        break;

      case '{':
      case '(':
        this.value = this.value.substring(0, start) + event.key + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + 1;
        const closingChar = event.key === '{' ? '}' : ')';
        this.value = this.value.substring(0, this.selectionStart) + closingChar + this.value.substring(this.selectionStart);
        this.selectionStart = this.selectionEnd = start + 1;
        event.preventDefault();
        break;

      case "'":
      case '"':
        this.value = this.value.substring(0, start) + event.key + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + 1;
        this.value = this.value.substring(0, this.selectionStart) + event.key + this.value.substring(this.selectionStart);
        this.selectionStart = this.selectionEnd = start + 1;
        event.preventDefault();
        break;

      case 'Backspace':
        if (start > 0 && this.value[start - 1] === this.value[start] && this.value[start - 1] !== ' ') {
          event.preventDefault();
          this.value = this.value.substring(0, start - 1) + this.value.substring(end);
          this.selectionStart = this.selectionEnd = start - 1;
        }
        break;

      case event.ctrlKey && event.key === 'o':
        event.preventDefault();
        openFile();
        break;

      case event.ctrlKey && event.key === 's':
        event.preventDefault();
        saveFile();
        break;

      default:
        break;
    }
  });

  return editor;
}

function createHighlightedDiv() {
  const highlightedDiv = document.createElement('pre');
  highlightedDiv.id = 'highlighted';
  highlightedDiv.style.backgroundColor = theme.backgroundColor || '#ffffff';
  highlightedDiv.style.color = theme.textColor || '#111111';
  highlightedDiv.style.padding = '10px';
  highlightedDiv.style.overflow = 'auto';
  return highlightedDiv;
}

document.body.appendChild(createHighlightedDiv());
loadTheme().then(_ => {});

function openFile() {
  remote.dialog.showOpenDialog({
    properties: ['openFile']
  }).then(result => {
    if (!result.canceled) {
      const filePath = result.filePaths[0];
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading file:', err);
        } else {
          document.querySelector('textarea').value = data;
          document.getElementById('highlighted').innerHTML = hljs.highlightAuto(data).value;
        }
      });
    }
  }).catch(err => {
    console.error(err);
  });
}

function saveFile() {
  remote.dialog.showSaveDialog({
    title: 'Save File',
    defaultPath: 'untitled.txt',
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

async function loadTheme() {
  try {
    const theme = await ipcRenderer.invoke('load-theme');
    console.log('Theme loaded:', theme);

    const editor = document.querySelector('textarea');
    editor.style.backgroundColor = theme.backgroundColor;
    editor.style.color = theme.textColor;
    editor.style.fontFamily = theme.fontFamily || 'monospace';
  } catch (error) {
    console.error('Failed to load theme:', error);
  }
}

module.exports = {Editor};