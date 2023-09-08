const { ipcRenderer } = require("electron");
const SerialPort = require("serialport");

let portsDropdown = document.getElementById("ports");
let connectButton = document.getElementById("connect");
let disconnectButton = document.getElementById("disconnect");
let outputElement = document.getElementById("output");

// Populate the serial port list
SerialPort.list().then((ports) => {
  ports.forEach((port) => {
    let option = document.createElement("option");
    option.value = port.path;
    option.text = port.path;
    portsDropdown.appendChild(option);
  });
});

// Connect to the selected serial port
connectButton.addEventListener("click", () => {
  let selectedPort = portsDropdown.value;
  ipcRenderer.send("connect", selectedPort);

  connectButton.disabled = true;
  disconnectButton.disabled = false;
});

// Disconnect from the serial port
disconnectButton.addEventListener("click", () => {
  ipcRenderer.send("disconnect");

  connectButton.disabled = false;
  disconnectButton.disabled = true;
});

// Update the display with incoming data
ipcRenderer.on("data", (event, data) => {
  outputElement.innerText += data;
});

// Handle errors
ipcRenderer.on("error", (event, error) => {
  outputElement.innerText += `Error: ${error}\n`;
});
