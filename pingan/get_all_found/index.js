function getAllCodes(cb,stepCb) {
    // http://fund.jrj.com.cn/action/fhs/Compare.jspa
    function getFunCode(fundCompany){
        var url = 'http://fund.jrj.com/action/fhs/SearchFundsByFundCompanyNameJson.jspa?fundCompanyName=' + encodeURI(encodeURI(fundCompany))+'&flag=f';
        return new Promise(function(s) {
            jQuery.ajax({
                type: "GET",
                url: url,
                dataType: "jsonp",
                jsonp: "callback",
                success: function(data){
                    // data = [{
                    //     fundCode: "970003",
                    //     fundName: "安信瑞鸿中短债A"
                    // }];
                    s(data);
                }
            });
        })
    }

    var allFoundsCodes = [];
    var allFounds = (() => {
        let founds = [];
        let tasks = [];
        let taskOver = function(data) {
            allFoundsCodes = allFoundsCodes.concat(data);
            stepCb({all: founds.length,current: founds.length - tasks.length});
            if (tasks.length) {
                setTimeout(() => {
                    tasks.pop()();
                },100);
            } else {
                cb(allFoundsCodes);
            }
        };
        let opts = document.getElementById('zcg_fundCompany').getElementsByTagName('option');
        for (let i = 0;i < opts.length;i++) {
            if (opts[i].value) {
                founds.push(opts[i].value);
            }
        }
        founds.forEach(f => {
            tasks.push((function () {
                getFunCode(f).then(taskOver)
            }).bind(null,f));
        });
        taskOver();
        stepCb({all: founds.length,current: 0});
        return founds;
    })();
}

let allDatas = [];
function getAllFoundStock(allFoundCodes,cb,stepCb,start) {
    start = start || 0;
    allFoundCodes = JSON.parse(JSON.stringify(allFoundCodes)).splice(start);
    let createTds = new (class {
        constructor() {
            this.foundCode = -1;
            this.ind = -1;
            this.obj = {};
            // 序号
            // 股票代码
            // 股票名称
            // 期初持有 基金家数
            // 期末持有 基金家数
            // 持有家数变化
            // 期初持股 总数(万股)
            // 期末持股 总数(万股)
            // 持股变化 (万股 )
            // 期初占流 通股本比 例(%)
            // 期末占流 通股本比 例(%)
            // 占流通股本比例变 化(%)
            this.content = ['index','code','name','start_have','end_have','change_have','start_get','end_get','change_get','start_percent','end_percent','change_percent'];
        }
        setFoundCode(foundCode) {
            this.foundCode = foundCode;
        }
        init() {
            this.ind = -1;
        }
        insert(content) {
            this.ind++;
            if (this.ind < this.content.length) {
                this.obj[this.content[this.ind]] = content;
            }
        }
        out() {
            // delete this.obj.name;
            this.obj.foundCode = this.foundCode;
            return JSON.parse(JSON.stringify(this.obj));
        }
    })
    let currentTime = () => {
        let ym = ['0331','0630','0930','1231'];
        let d = new Date();
        let year = d.getFullYear();
        let month = (d.getMonth()  + 1) + '';
        month = month.length === 1 ? '0' + month : month;
        let day = d.getDate() + '';
        day = day.length === 1 ? '0' + day : day;
        let cym = month + day;
        let t = [];
        if (cym < ym[0]) {
            t = [-1,2,-1,3];
        } else if (cym < ym[1]) {
            t = [-1,3,0,0];
        } else if (cym < ym[2]) {
            t = [0,0,0,1];
        } else {
            t = [0,1,0,2];
        }
        return [`${year - t[0] }${ym[t[1]]}`,`${year - t[2] }${ym[t[3]]}`];
    };
    function fetchFoundDom(foundCode) {
        createTds.setFoundCode(foundCode);
        return fetch(`http://fund.jrj.com.cn/action/fhs/Compare.jspa?stockCode=&fundCode=${foundCode}&reportDateBegin=${currentTime[0]}&reportDateEnd=${currentTime[1]}`).then(_ => _.text()).then(_ => {
            let div = document.createElement('div');
            div.innerHTML = _;
            let trs = div.getElementsByTagName('table')[0].getElementsByTagName('tbody')[0].getElementsByTagName('tr');
            for (let i = 0;i < trs.length;i++) {
                let tds = trs[i].getElementsByTagName('td');
                createTds.init();
                for (let j = 0;j < tds.length;j++) {
                    createTds.insert(tds[j].innerText.trim());
                }
                allDatas.push(createTds.out());
            }
        });
    }

    let tasks = [];
    let taskOver = function() {
        stepCb({all: allFoundCodes.length,current: allFoundCodes.length - tasks.length});
        if (tasks.length) {
            setTimeout(() => {
                tasks.pop()();
            },100);
        } else {
            cb(allDatas);
        }
    };
    allFoundCodes.forEach(f => {
        tasks.push((function () {
            fetchFoundDom(f.fundCode).then(taskOver)
        }).bind(null,f));
    });
    taskOver();
}

function download(filename,datas) {
    // var filename = 'hello.json'
    var a = document.createElement('a')
    var blob = new Blob([JSON.stringify(datas)]);
    a.download = filename
    a.href = URL.createObjectURL(blob);
    a.click();
    URL.revokeObjectURL(blob);
}

// 理论的执行过程如下
function image() {
    console.log("开始获取各大机构的基金代码");
    getAllCodes(function (codes) {
        console.log("开始获取各个基金的持股信息");
        download("所有基金的代码.json",codes);
        getAllFoundStock(codes,function (allDatas) {
            window.allDatas = allDatas;
            download("所有基金持仓情况.json",allDatas);
        },console.log);
    },console.log);
}