const http = require('http');
const fs = require('fs');
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
let state = "doing";
let totalDatas = (new class{
    constructor() {
        this.datas = [];
        this.saveWhenLength = 1;
        this.lastFile = null;
        this.lastEchartOption = {
            in: {},
            out: {},
            deta: {},
        };
        this.lastEchartOptionFile = null;
        this.uct = (_ => {
            let d = new Date();
            return d.getDate();
        })();
    }
    push(d) {
        this.datas.push(d);
        if (this.datas.length === this.saveWhenLength) {
            let tmp = this.datas;
            this.datas = [];
            if (this.lastFile && fs.existsSync(this.lastFile)) {
                fs.unlinkSync(this.lastFile);
            }
            let txt = 'tmp/' + (new Date().getTime()) + '.txt';
            this.lastFile = txt;
            fs.writeFileSync(txt,JSON.stringify(tmp),'utf-8');
            this.toEchart(JSON.parse(tmp),'in');
            this.toEchart(JSON.parse(tmp),'out');
            this.toEchart(JSON.parse(tmp),'deta');
        }
    }
    toEchart(data,tar) {
        let yAxisData = [];
        let seriesA = [];
        let seriesB = [];
        let seriesC = [];
        let d = [];
        for (let i in data) {
            d.push({
                ...data[i],
                code: i
            });
            d = d.sort((a,b) => a[tar] - b[tar]);
        }
        d.forEach(dd => {
            yAxisData.push(`${dd.name}(${dd.code})`);
            seriesA.push(dd.deta);
            seriesB.push(dd.out);
            seriesC.push(dd.in);
        })

        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                position: ['100px', '20px']
            },
            legend: {
                data: ['量', '买入', '卖出']
            },
            dataZoom:{
                orient:"vertical", //水平显示
                show:true, //显示滚动条
                start:0, //起始值为20%
                end:100,  //结束值为60%
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'value'
                }
            ],
            yAxis: [
                {
                    type: 'category',
                    axisTick: {
                        show: false
                    },
                    data: yAxisData
                }
            ],
            series: [
                {
                    name: '量',
                    type: 'bar',
                    label: {
                        show: true,
                        position: 'inside'
                    },
                    data: seriesA
                },
                {
                    name: '卖出',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        show: true
                    },
                    data: seriesB
                },
                {
                    name: '买入',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        show: true,
                        position: 'left'
                    },
                    data: seriesC
                }
            ]
        };

        let txt = 'tmp/' + (new Date().getTime()) + '.txt';
        if (this.lastEchartOptionFile && fs.existsSync(this.lastEchartOptionFile)) {
            fs.unlinkSync(this.lastEchartOptionFile);
        }
        this.lastEchartOptionFile = txt;
        console.log(`最新图表文件为 ${txt}
        可以到下面网址查看效果
        http://localhost:${port}`);
        this.lastEchartOption[tar] = option;
        fs.writeFileSync(txt,`option = ` + JSON.stringify(option,'','\t'),'utf-8');
    }
});
setInterval(function () {
    let d = new Date();
    if (d.getDate() != totalDatas.uct) {
        totalDatas.uct = d.getDate();
        totalDatas.lastFile = null;
        totalDatas.lastEchartOptionFile = null;
    }
},1000 * 60 * 60 * 3);

function dearDatas(req,res) {
    var data = '';

    req.on('data', function (chunk) {
        data += chunk;
    });

    req.on('end', function () {
        data = decodeURI(data);
        console.log(data);
        totalDatas.push(data);
        res.end("over");
    });
}

const resFile = (res,file) => {
    res.setHeader('Content-Type','text/html;charset=utf-8');
    fs.createReadStream(file).pipe(res);
};

server.on('request',function (req,res) {
    if (req.url === '/save') {
        dearDatas(req,res);
    } else if (req.url.startsWith("/opt/in")) {
        res.end(JSON.stringify(totalDatas.lastEchartOption.in));
    } else if (req.url.startsWith("/opt/out")) {
        res.end(JSON.stringify(totalDatas.lastEchartOption.out));
    } else if (req.url.startsWith("/opt/deta")) {
        res.end(JSON.stringify(totalDatas.lastEchartOption.deta));
    } else if (req.url.startsWith('/')) {
        resFile(res,'./echart.html');
    }
});

server.listen(port,function () {
    console.log('server run in port : ' + port);
});