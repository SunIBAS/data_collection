function getSecondData(limit) {
    let d = new Date();
    limit = limit || 120;
    fetch(
        `https://www.okex.com/priapi/v5/market/candles?instId=BTC-USDT&bar=1m&limit=${limit}&t=${d.getTime()}`,{method: 'get'}).then(_ => _.text()).then(JSON.parse).then(_ => {
        window.ret = _;
        let total = 0;
        let max = -1;
        let min = 1e10;
        let dir = 0;
        _.data.map(d => +d[2]).map(d => {
            total += d;
            max = max > d ? max : d;
            min = min > d ? d : min;
        });
        if (max + min > total / limit * 2) {
            dir = 'up';
        } else {
            dir = 'down';
        }
        console.log(JSON.stringify({
            avg: total / limit,
            max,
            min,
            dir
        },'','\t'));
    });
}