# Atomic  0.1.0 Development

## Description
Atomic is a code editor built on Electron designed to be an Atom clone, not a fork.

## Features

**DONE**
- Customizable themes
- Customizable keybindings
- Customizable settings

**Active Development**
- Syntax highlighting (WIP)
- Code folding (WIP)
- Terminal Panel (WIP)
- File tree (WIP)
- File tabs (WIP)

**On the Horizon**
- Code completion (WIP)
- Linting (WIP)
- Git integration (WIP)
- Plugin support (WIP)
- Multi-cursor support (WIP)
- Find and replace (WIP)
- Snippets (WIP)
- Project management (WIP)
- Debugging (WIP) [Atom doesnt have this I am aware]

**Possible Future Features**
- I Want to use Electron but as it is inefficient and large I am considering using a different framework like Tauri (I am using Electron to keep the feel of Atom because it used Electron)


## Installation
Installing: Atomic currently doesn't have a stable release, but you can clone the repository and run the following commands to get started with development!

*Atomic is **64bit** only!*

```bash
git clone https://github.com/Thoq-jar/Atomic.git
cd Atomic
npm i
npm start
```

## Building
To build Atomic you have to run the package command for your system:

Linux with Intel/AMD CPU:
```bash
npm run package-x64-linux
```

Or for example a Mac with an Apple Silicon:
```bash
npm run package-arm64-darwin
```

And if you want to build all 6 platforms (Linux/linux - x64, arm64 | Darwin/macOS - arm64, x64 | Windows/win32 - x64, arm64) you can run:
```bash
npm run package
```

To clean up all the builds and node run:
```bash
npm run clean
```

## Every build command:

Linux Intel/AMD 64bit
```bash
npm run package-x64-linux
```

Linux ARM 64bit
```bash
npm run package-arm64-linux
```

Darwin/macOS Apple Silicon/ARM 64bit
```bash
npm run package-arm64-darwin
```

Darwin/macOS Intel 64bit
```bash
npm run package-x64-darwin
```

Windows/win32 Intel/AMD 64bit
```bash
npm run package-x64-win32
```

Windows/win32 ARM 64bit
```bash
npm run package-arm64-win32
```

## License
See license file: [MIT](LICENSE)
