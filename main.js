// main.js - Electron Main Process

const { app, BrowserWindow, Tray, Menu, globalShortcut, screen } = require('electron');
const path = require('path');
const fs = require('fs'); // Import the file system module to check for files

// --- MODIFICATION: Moved mainWindow declaration to the top-level scope ---
// This ensures it's accessible by the 'second-instance' event handler.
let mainWindow;

// --- NEW: Single Instance Lock ---
// This prevents multiple instances of the app from running.
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance. We should focus our window.
    if (mainWindow) {
      // --- MODIFICATION: More robust logic to show and focus the window ---
      if (!mainWindow.isVisible()) {
        mainWindow.show();
      }
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.focus();
    }
  });

  // Keep a global reference of the tray object, if you don't, it will
  // be closed automatically when the JavaScript object is garbage collected.
  let tray;

  // --- MODIFICATION: Using a PNG icon for maximum compatibility ---
  const iconPath = path.join(__dirname, 'icon.png');

  // Function to toggle window visibility
  function toggleWindow() {
      if (mainWindow) { // Ensure mainWindow exists
        if (mainWindow.isVisible()) {
            mainWindow.hide();
        } else {
            mainWindow.show();
        }
      }
  }

  function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: false,
        contextIsolation: true,
      },
      icon: fs.existsSync(iconPath) ? iconPath : undefined,
      title: "Autum's Gemini",
    });
    
    // --- NEW: Remove the menu bar ---
    mainWindow.setMenuBarVisibility(false);

    mainWindow.loadURL('https://gemini.google.com/');

    mainWindow.on('close', (event) => {
      if (!app.isQuitting) {
        event.preventDefault();
        mainWindow.hide();
      }
      return false;
    });
  }

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  app.whenReady().then(() => {
    createWindow();

    app.setLoginItemSettings({
      openAtLogin: true,
      path: app.getPath('exe'),
    });

    // --- MODIFICATION: Check if the shortcut was registered successfully ---
    const ret = globalShortcut.register('Alt+Space', toggleWindow);
    if (!ret) {
      console.log("Could not register 'Alt+Space'. It's likely used by another application.");
    }

    if (fs.existsSync(iconPath)) {
      tray = new Tray(iconPath);

      const contextMenu = Menu.buildFromTemplate([
        {
          label: "Show/Hide Autum's Gemini",
          click: toggleWindow,
        },
        {
          label: 'Quit',
          click: () => {
            app.isQuitting = true;
            app.quit();
          },
        },
      ]);

      tray.setToolTip("Autum's Gemini");
      tray.setContextMenu(contextMenu);
      tray.on('click', toggleWindow);

    } else {
      console.warn("Warning: 'icon.png' not found. The app will run without a tray icon.");
    }

    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) {
          createWindow();
      } else {
          mainWindow.show();
      }
    });
  });

  app.on('will-quit', () => {
      globalShortcut.unregisterAll();
  });
}