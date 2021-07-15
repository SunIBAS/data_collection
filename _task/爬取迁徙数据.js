const {getFromDay} = require('./../_utils/getDays')

function Task_QianxiBaidu(cb,year,month,day) {
    // 下载迁入数据
    let callDayRangeMoveIn = require('./../qianxi.baidu/迁入地爬取').callDayRange;
    let callDayRangeMoveOut = require('./../qianxi.baidu/迁出地爬取').callDayRange;
    let {
        autoRun
    } = require('./../qianxi.baidu/迁入迁出趋势');
    let {
        autoRunCNCXQD
    } = require('./../qianxi.baidu/城内出行强度');
    callDayRangeMoveIn(function () {
        console.log('moveout 开始执行');
        callDayRangeMoveOut(function () {
            autoRun(function () {
                cb();
                autoRunCNCXQD(cb);
            });
            // cb()
        },year,month,day,year,month,day)
    },year,month,day,year,month,day);
}

let nd = getFromDay(2021,5,1,true);
let d = nd();

function next() {
    if (d) {
        Task_QianxiBaidu(next,+d.substring(0,4),+d.substring(4,6),+d.substring(6,8));
        d = nd();
    } else {
        conosle.log("all over");
    }
}
next();
// Task_QianxiBaidu();