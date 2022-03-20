var defaultDataName = {
    Close: 'Close',
    Open: 'Open',
    Low: 'Low',
    High: 'High'
};
class getAvg {
    constructor(len) {
        this.len = len;
        this.sum = 0;
        this.ds = [];
    }
    getAvg(d) {
        this.ds.push(d);
        this.sum += d;
        if (this.ds.length >= this.len) {
            let avg = this.sum / this.len;
            this.sum -= this.ds.shift();
            return avg;
        } else {
            return null;
        }
    }
}
let ts2date = (function () {
    let d = new Date();
    return ts => {
        d.setTime(ts * 1000);
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    }
})();
let randNums = (function () {
    let total = 200;
    let times = 2;
    let n = [];
    // 10% -> 02/200
    // 9%  -> 04/200
    // 8%  -> 08/200
    // 7%  -> 14/200
    // 6%  -> 19/200
    // 5%  -> 22/200
    // 4%  -> 25/200
    // 3%  -> 28/200
    // 2%  -> 32/200
    // 1%  -> 37/200
    // 0%  -> 10/200
    let rate = [10,37,32,28,25,22,19,14,8,4,2].map(_=>times*_);
    for (let i = 0;i < total * times;i++) {
        let ind = parseInt(Math.random() * 11);
        while (!rate[ind]) ind = parseInt(Math.random() * 10);
        let nn = parseInt((Math.random() + ind) * 10) / 1000;
        n.push(nn >= 0.10 ? 0.10 : nn);
        rate[ind]--;
    }
    return n;
})();
// dataName
// guss = { type:'lift | down | rand', days: 10 }
function getOption(klines,lines,dataName,guss,cutLength) {
    dataName = dataName || defaultDataName;
    lines = lines || [5,10,20,30,60];
    let dates = [];
    let dayData = [];
    let daySum = [];
    let deta = [];
    let maxDay = 0;
    let dayLen = lines.length;
    let addGussNode = {
        lift(preNode) {
            let c = preNode[dataName.Close];
            let cr = c * randNums[parseInt(Math.random() * randNums.length)] + c;
            return {
                [dataName.Open]: c,
                [dataName.Low]: c,
                [dataName.Close]: cr,
                [dataName.High]: cr,
            }
        },
        down(preNode) {
            let c = preNode[dataName.Close];
            let cr = c - c * randNums[parseInt(Math.random() * randNums.length)];
            return {
                [dataName.Open]: c,
                [dataName.High]: c,
                [dataName.Low]: cr,
                [dataName.Close]: cr,
            }
        },
        rand(preNode) {
            if (Math.random() > 0.5) {
                return addGussNode.lift(perNode);
            } else {
                return addGussNode.down(preNode);
            }
        }
    };
    if (guss) {
        let lastLineNode = lines[lines.length - 1];
        for (let i = 0;i < guss.days;i++) {
            lastLineNode = addGussNode[guss.type](lastLineNode);
            klines.push(lastLineNode);
        }
    }
    lines.forEach(l => {
        dayData.push([]);
        daySum.push(new getAvg(l));
        maxDay = maxDay > l ? maxDay : l;
    });
    let ks = klines.map((o,ind) => {
        // dates.push(ts2date(o.Time));
        dates.push(ind);
        for (let i = 0;i < dayLen;i++) {
            dayData[i].push(daySum[i].getAvg(o[dataName.Close]));
        }
        return [o[dataName.Open],o[dataName.Close],o[dataName.Low],o[dataName.High]];
    });

    for (let i = 0;i < dayData[0].length;i++) {
        if (i < maxDay) {
            deta.push(null);
        } else {
            let max = dayData[0][i];
            let min = dayData[0][i];
            for (let j = 1;j < dayLen;j++) {
                max = max < dayData[j][i] ? dayData[j][i] : max;
                min = min > dayData[j][i] ? dayData[j][i] : min;
            }
            deta.push(max - min);
        }
    }

    if (cutLength && typeof cutLength === 'number') {
        let start = dates.length - cutLength;
        dates = dates.slice(start);
        ks = ks.slice(start);
        deta = deta.slice(start);
        dayData = dayData.map(dd => dd.slice(start));
    }

    let option = {
        // title: {
        //     text: '比亚迪',
        //     left: 0
        // },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        legend: {
            data: ['日K', ...lines.map(_ => `MA${_}`),'Deta']
        },
        grid: {
            left: '10%',
            right: '10%',
            bottom: '15%'
        },
        xAxis: {
            type: 'category',
            data: dates,
            boundaryGap: false,
            axisLine: { onZero: false },
            splitLine: { show: false },
            min: 'dataMin',
            max: 'dataMax'
        },
        yAxis: [
            {
                scale: true,
                splitArea: {
                    show: true
                }
            },
            {
                type: 'value',
                name: 'Deta',
            }
        ],
        dataZoom: [
            {
                type: 'inside',
                start: 50,
                end: 100
            },
            {
                show: true,
                type: 'slider',
                top: '90%',
                start: 50,
                end: 100
            }
        ],
        series: [
            {
                name: '日K',
                type: 'candlestick',
                data: ks,
            },
            ...lines.map((l,ind) => {
                return {
                    name: `MA${l}`,
                    type: 'line',
                    data: dayData[ind],
                    smooth: true,
                    lineStyle: {
                        opacity: 0.5
                    }
                };
            }),
            {
                name: 'Deta',
                type: 'line',
                yAxisIndex: 1,
                tooltip: {
                    valueFormatter: function (value) {
                        return value + ' °C';
                    }
                },
                data: deta
            }
        ]
    };

    return {
        ks,
        ma: dayData,
        daySum,
        deta,
        option,
    }
}

module.exports = {
    getOption
};
