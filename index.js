const { app, BrowserWindow, ipcMain } = require('electron');
const SerialPort = require('serialport');

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');

    SerialPort.list().then(ports => {
        mainWindow.webContents.send('port-list', ports);
    });
});

ipcMain.on('connect-to-port', (event, path) => {
    const port = new SerialPort(path, { baudRate: 9600 });

    port.on('data', (data) => {
        mainWindow.webContents.send('serial-data', data.toString());
    });

    port.on('error', (err) => {
        mainWindow.webContents.send('serial-error', err.message);
    });
});

