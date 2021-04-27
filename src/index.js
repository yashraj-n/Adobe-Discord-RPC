const { app, BrowserWindow, ipcMain, autoUpdater } = require('electron');
const path = require('path');
const config = require("./config.json");
const discord = require("discord-rpc");

require('update-electron-app')({
  repo: "yashraj-n/Adobe-Discord-RPC"
});

if (require('electron-squirrel-startup')) {
  app.quit();
}
let mainWindow;
const singletonLock = app.requestSingleInstanceLock();

if (!singletonLock) {
  app.quit();
} else {
  app.on('second-instance', (e, cmd, dir) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  })
}

const createWindow = () => {

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(__dirname, "Assets", "logo.ico"),
    show: false
  });

  mainWindow.loadFile(path.join(__dirname, "Frontend", "index.html"));
  mainWindow.setMenuBarVisibility(false)
  mainWindow.maximize();
  mainWindow.setResizable(false)
  mainWindow.show();

};

app.on('ready', createWindow);

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


ipcMain.on("rpc-initialize", (e, value) => {
  value = JSON.parse(value)
  switch (value.application) {
    case "After Effects":
      SetupDiscordRPC(value.project, value.description, config.ae.image, config.ae.clientID, value.time)
      break;
    case "Premier Pro":
      SetupDiscordRPC(value.project, value.description, config.pr.image, config.pr.clientID, value.time)
      break;
    case "Photoshop":
      SetupDiscordRPC(value.project, value.description, config.ps.image, config.ps.clientID, value.time)
      break;
    case "Illustrator":
      SetupDiscordRPC(value.project, value.description, config.ai.image, config.ai.clientID, value.time)
      break;
    default:
      break;
  }
});

ipcMain.on("restart", (e, v) => {
  app.relaunch();
  app.quit();
})


async function SetupDiscordRPC(project, description, image, id, time) {
  let client = new discord.Client({
    transport: "ipc"
  });
  client.login({ clientId: id })

  if (time) {
    try {
      client.on("ready", () => {
        
        mainWindow.webContents.send("rpc-show", {
          avatar: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png?size=16`,
          username: `${client.user.username}#${client.user.discriminator}`
        });
        client.request("SET_ACTIVITY", {
          pid: process.pid,
          activity: {
            details: project,
            state: description,
            timestamps: {
              start: new Date().getTime()
            },
            assets: {
              large_image: image,
              large_text: "https://github.com/yashraj-n/Adobe-Discord-RPC",
            }
          }
        })
      })
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      client.on("ready", () => {
        mainWindow.webContents.send("rpc-show", {
          avatar: client.user.avatar,
          username: `${client.user.username}#${client.user.discriminator}`
        }); client.request("SET_ACTIVITY", {
          pid: process.pid,
          activity: {
            details: project,
            state: description,
            assets: {
              large_image: image,
              large_text: "https://github.com/yashraj-n",
            }
          }
        })
      })
    } catch (error) {
      console.log(error);
    }
  }


}



