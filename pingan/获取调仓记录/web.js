// https://m.stock.pingan.com/invest/shipan/top.html
var getParam = page => {
    return {
        "appName": "TOUGU",
        "tokenId": "",
        "cltplt": "h5",
        "cltver": "1.0",
        "body": {
            "asc": 0,
            "ps": 10,
            "pt": null,
            "nt": "578800002327",
            "pn": page
        }
    };
};

var getShotter = page => {
    return fetch('https://m.stock.pingan.com/gentou/v1/shortterm/ranking',{method: 'post',body: JSON.stringify(getParam(page))}).then(_ => _.text()).then(JSON.parse);
}
var getLongline = page => {
    return fetch('https://m.stock.pingan.com/gentou/v1/longline/ranking',{method: 'post',body: JSON.stringify(getParam(page))}).then(_ => _.text()).then(JSON.parse);
}
var getWinner = page => {
    return fetch('https://m.stock.pingan.com/gentou/v1/winner/ranking',{method: 'post',body: JSON.stringify(getParam(page))}).then(_ => _.text()).then(JSON.parse);
}
var hotsub = page => {
    return fetch('https://m.stock.pingan.com/gentou/v1/hotsub/ranking',{method: 'post',body: JSON.stringify(getParam(page))}).then(_ => _.text()).then(JSON.parse);
}

var _task = [];
var datas;
var over = function() {
    getEvery();
};

[getShotter,getLongline,getWinner,hotsub].forEach(getPage => {
    for (var i = 0;i < 5;i++) {
        _task.push(function(i) {
            getPage(i).then(d => {
                datas = datas.concat(d.data.list);
                if (task.length) {
                    task.pop()();
                } else {
                    over();
                }
            });
        }.bind(null,i));
    }
});
// 从获取人开始
function start() {
    datas = [];
    task = [].concat(_task);
    task.pop()();
}

window.dd = new Date().getTime();
// 24 + 6.5 小时内都接受
var checkToday = function(_d) {
    let dt = _d - dd;
    return Math.abs(dt) < 30.5 * 60 * 60 * 1000;
};
var allDear = {
    // code: {deta: 10,name: '',in: 0,out: 0}, // in.out 买入卖出操作数
};
function getEvery() {
    allDear = {};
    var getOneParam = id => {return {"appName":"TOUGU","tokenId":"","cltplt":"h5","cltver":"1.0","body":{"action":0,"asc":0,"ps":10,"pt":null,"nt":null,"pn":0,"gid":id}};};

    var getOne = id => {
        return fetch('https://m.stock.pingan.com/gentou/v1/group/matching/history',{method: 'post',body: JSON.stringify(getOneParam(id))}).then(_ => _.text()).then(JSON.parse);
    }
    for (var i = 0;i < datas.length;i++) {
        task.push(function(gid) {
            getOne(gid).then(d => {
                d.data.list.forEach(d => {
                    if (checkToday(d.time)) {
                        let deta = d.fSpace - d.tSpace;
                        if (!(d.code in allDear)) {
                            allDear[d.code] = {deta: 0,name: d.name,in: 0,out: 0};
                        }
                        if (deta > 0) allDear[d.code].in++; else allDear[d.code].out++;
                        allDear[d.code].deta += deta;
                    }
                });
                if (task.length) {
                    task.pop()();
                } else {
                    setTimeout(_ => getEveryOver(),500);
                }
            });
        }.bind(null,datas[i].gid));
    }
    task.pop()();
}
var getEveryOver = function() {
    let save = function(data) {
        fetch("http://localhost:3308/save",{method:'post',body:JSON.stringify(data)});
    }
    save(allDear);
}

setInterval(function () {
    let ddd = new Date();
    if (ddd.getHours() > 15 && ddd.getMinutes() > 10) {
        return;
    } else if (ddd.getHours() < 9) {
        return;
    } else if (ddd.getUTCDay() > 5) {
        // 周末
        return;
    }
    start();
})