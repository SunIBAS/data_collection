function Task_2019nConvDatas(cb) {
    // 1.同步全国数据
    let {getChinaChange} = require('./../2019-nCoV-Datas/getChinaChange');
    // 2.同步爬取到本地
    let {
        toUpdateFile
    } = require('./../2019-nCoV-Datas/autoRefleshAndDear');

    getChinaChange(function () {
        toUpdateFile(cb);
    });
}

function Task_QianxiBaidu(cb) {
    // 下载迁入数据
    let callPreDayMoveIn = require('./../qianxi.baidu/迁入地爬取').callPreDay;
    let callPreDayMoveOut = require('./../qianxi.baidu/迁出地爬取').callPreDay;
    let {
        autoRun
    } = require('./../qianxi.baidu/迁入迁出趋势');
    let {
        autoRunCNCXQD
    } = require('./../qianxi.baidu/城内出行强度');
    callPreDayMoveIn(function () {
        callPreDayMoveOut(function () {
            autoRun(function () {
                cb();
                // autoRunCNCXQD(cb);
            });
        })
    });
}

Task_2019nConvDatas(function () {
    Task_QianxiBaidu(_ => console.log("over"));
});

