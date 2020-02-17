const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 3000;
const server = http.createServer();

let mime={
    '.js':'application/javascript',
    '.css':'text/css',
    '.html': 'text/html;charset=utf-8'
};
const resFile = (res,file) => {
    res.setHeader('Content-Type',mime[file.match(/\.\w+$/)[0]] +';charset=utf-8');
    fs.createReadStream(file).pipe(res);
};

const getJsonFilesName = () => {
    return fs.readdirSync(path.join('html','out'))
        .filter(_ => _[0] !== '_')
        .sort((a,b) => parseInt(a.replace(/[-]/g,'0')) - parseInt(b.replace(/[-]/g,'0')));
};

const dearApi = (req,res) => {
    let urls = req.url.split('/').filter(_ => _);
    if (urls[0] === "api") {
        switch (urls[1]) {
            case "files":
                res.end(JSON.stringify(getJsonFilesName()));
                break;
            default:
                res.end('err');
                break;
        }
    }
};

server.on('request',function (req,res) {
    if (req.url === '/') {
        resFile(res,'html/index.html');
    } else if (req.url.startsWith('/api')) {
        dearApi(req,res);
    } else {
        let file = path.join("html", req.url);
        if (fs.existsSync(file)) {
            resFile(res,file);
        } else {
            res.end('');
        }
    }
});


server.listen(port,function () {
    console.log('server run in port : ' + port);
});