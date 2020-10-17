const http = require('http');
const fs = require('fs');
const calc = require('./calc');
const {
    downloadOneStoke
} = require('./getAllDataFroOneStock');
const server = http.createServer(function(req,res){
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if ( req.method === 'OPTIONS' ) {
        res.writeHead(200);
        res.end();
        return;
    }
});

let port = "3308";
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
const getParamsFromUrl = (url) => {
    let params = {};
    (url.split('?')[1] || '').split('&').forEach(kv => {
        kv = kv.split('=');
        params[kv[0]] = kv[1];
    });
    return params;
};

const getEchartOption = (url,res) => {
    let params = getParamsFromUrl(url);
    let need = ['code','buyP','sealP','hand','totalCash','fromYear','fromMonth'];
    let ok = true;
    need.forEach(n => {
        ok &= (n in params);
    });
    if (ok) {
        res.end(JSON.stringify(calc(params.code,+params.buyP,+params.sealP,+params.hand,+params.totalCash,+params.fromYear,+params.fromMonth)));
    } else {
        res.end(JSON.stringify({code: -1}));
    }
};

const updateOneStock = (url,res) => {
    let params = getParamsFromUrl(url);
    if ('code' in params) {
        downloadOneStoke(params.code)
            .then(alldatas => {
                fs.writeFileSync('./datas/' + params.code + '.json',JSON.stringify(alldatas),'utf-8');
                res.end(`{code: 200}`);
            });
    } else {
        res.end(`{code: -1}`)
    }
}

server.on('request',function (req,res) {
    if (req.url === '/') {
        // 主页
        resFile(res,'draw.html');
    } else if (req.url.startsWith('/dist')) {
        // 脚本
        resFile(res,'../../_utils/' + req.url.split('dist')[1]);
    } else if (req.url.startsWith('/getEchartOption')) {
        // echart 的 option 数据
        getEchartOption(req.url,res);
    } else if (req.url.startsWith('/updateOneStock')) {
        updateOneStock(req.url,res);
    } else {
        res.end('');
    }
});

let params = process.argv.splice(2);
if (params.length) {
    port = params[0];
}
server.listen(port,function () {
    console.log('server run in port : ' + port);
});