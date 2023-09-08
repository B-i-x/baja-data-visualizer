const { app, BrowserWindow, ipcMain } = require("electron");
const SerialPort = require("serialport");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile("index.html");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

let serialPort;

ipcMain.on("connect", (event, port) => {
  serialPort = new SerialPort(port, { baudRate: 9600 });

  serialPort.on("data", (data) => {
    event.reply("data", data.toString());
  });

  serialPort.on("error", (error) => {
    event.reply("error", error.message);
  });
});

ipcMain.on("disconnect", () => {
  if (serialPort) {
    serialPort.close();
  }
});
