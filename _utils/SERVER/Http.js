const http = require('http');
const url = require('url')
const querystring = require('querystring')
const fs = require('fs');
const path = require('path');
// const port = 3000;

let mime={
    '.js':'application/javascript',
    '.css':'text/css',
    '.html': 'text/html;charset=utf-8',
    '.jpg': 'image/jpg',
    '.png': 'image/png',
};
const resFile = (res,file) => {
    res.setHeader('Content-Type',mime[file.match(/\.\w+$/)[0]] +';charset=utf-8');
    if (fs.existsSync(file)) {
        fs.createReadStream(file).pipe(res);
    } else {
        setTimeout(() => {
            if (fs.existsSync(file)) {
                fs.createReadStream(file).pipe(res);
            } else {
                res.end('--==--');
            }
        },1000);
    }
};

function startServer(port,dearReq) {
    http.createServer((req, res) => {
        // 定义公共变量，存储请求方法、路径、数据
        const method = req.method
        let path = ''
        let get = {}
        let post = {}

        // 判断请求方法为GET还是POST，区分处理数据
        if (method === 'GET') {
            // 使用url.parse解析get数据
            const { pathname, query } = url.parse(req.url, true)

            path = pathname
            get = query

            complete()
        } else if (method === 'POST') {
            path = req.url
            let datas = "";

            req.on('data', (buffer) => {
                // 获取POST请求的Buffer数据
                datas += buffer;
            })

            req.on('end', () => {
                // 将Buffer数据合并
                // let buffer = Buffer.concat(arr)

                // 处理接收到的POST数据
                post = JSON.parse(datas || "{}")

                complete()
            })
        }

        // 在回调函数中统一处理解析后的数据
        function complete() {
            // console.log(method, path, get, post);
            // res.writeHead(200);
            // res.end(JSON.stringify({
            //     method,path,get,post
            // }));
            dearReq(method,path,method === "POST" ? post :get,{req,res});
        }
    })
        .listen(port,function () {
        console.log('server run in port : ' + port);
    });
}

module.exports = {
    startServer,
    resFile
}