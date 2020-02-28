const { app, BrowserWindow } = require('electron')

function createWindow () {
    // 创建浏览器窗口
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true,
            webSecurity: false,
            preload: process.cwd() + "\\resources\\app.asar\\preload.js"
        }
    });

    // 加载index.html文件
    // win.loadFile('index.html')
    win.loadURL('http://data.stats.gov.cn');
}

app.whenReady().then(createWindow);