const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 8886;
const server = http.createServer();
const config = require('./../config');

let mime={
    '.js':'application/javascript',
    '.json':'application/javascript',
    '.css':'text/css',
    '.html': 'text/html;charset=utf-8'
};
const resFile = (res,file) => {
    res.setHeader('Content-Type',mime[file.match(/\.\w+$/)[0]] +';charset=utf-8');
    fs.createReadStream(file).pipe(res);
};

const getJsonFilesName = () => {
    return fs.readdirSync(config.resultPath);
};

const dearApi = (req,res) => {
    let urls = req.url.split('/').filter(_ => _);
    if (urls[0] === "api") {
        switch (urls[1]) {
            case "files":
                res.setHeader('Content-Type','text/text;charset=utf-8');
                res.end(JSON.stringify(getJsonFilesName(),'','\t'));
                break;
            case "data":
                let file = path.join(config.resultPath,decodeURI(urls[urls.length - 1]));
                if (fs.existsSync(file)) {
                    resFile(res,file);
                } else {
                    res.end("[]");
                }
                break;
            default:
                res.end('err');
                break;
        }
    }
};

server.on('request',function (req,res) {
    if (req.url === '/') {
        resFile(res,'index.html');
    } else if (req.url.startsWith('/api')) {
        dearApi(req,res);
    } else {
        let file = req.url.substring(1);
        if (fs.existsSync(file)) {
            console.log(file);
            resFile(res,file);
        } else {
            res.end('');
        }
    }
});


server.listen(port,function () {
    console.log('server run in port : ' + port);
});