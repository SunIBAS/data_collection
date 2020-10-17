const fs = require('fs');

class Dear {
    constructor(buy,seal,hand,totalCash) {
        // 买
        this.buy = [];
        this.buyIndex = 0;
        // 卖
        this.seal = [];
        // 手上剩下几手
        this.totalHand = 0;
        this.canUseCash = totalCash / 100;
        // 一次买入手
        this.hand = hand;
        this.buyP = buy;
        this.sealP = seal;
        this.maxBuyHand = 0;
        this.buyHand = 0;
        // 赚多少
        this.earn = 0;
        this.lock = -1;
        this.log = [];
        this.logFn = (tar,hand,price,date) => {
            return `[${date}] ${tar} ${hand} hand , price is ${price}`;
        };
        // 持有记录
        this.has = {};
        this.startCash = totalCash / 100;
        this.currentCash = totalCash / 100;
        this.totalCash = {};
    }

    buyIn(price,date,logFn) {
        if (price <= this.buyP && price * this.hand < this.canUseCash) {
            this.buy.push({
                hand: this.hand,
                price: price,
                date
            });
            this.totalHand += this.hand;
            this.canUseCash -= price * this.hand;
            this.buyHand += this.hand;
            if (this.buyHand > this.maxBuyHand) {
                this.maxBuyHand = this.buyHand;
            }
            this.has[date] = this.buyHand;
            this.lock = this.buy.length - 1;
            this.log.push((logFn || this.logFn)('buy',this.hand,price,date));
        } else {
            this.lock = -1;
        }
    }
    sealAll(price,date,logFn) {
        if (price >= this.sealP && this.totalHand) {
            let lockHand = 0;
            let laskIndex = this.buy.length;
            if (this.lock >= 0) {
                lockHand = this.buy[this.lock].hand;
                laskIndex = this.lock;
            }
            let sealHand = 0;
            let todayEarn = 0;
            for (let i = this.buyIndex;i < laskIndex;i++) {
                todayEarn += (price - this.buy[i].price) * this.buy[i].hand;
                this.canUseCash += price * this.buy[i].hand;
                this.totalHand -= this.buy[i].hand;
                sealHand += this.buy[i].hand;
                this.log.push((logFn || this.logFn)('seal',this.hand,this.buy[i].price,date));
            }
            sealHand ? this.seal.push({hand: sealHand,price: price,date}) : '';
            this.buyIndex = laskIndex;
            this.buyHand = lockHand;
            this.has[date] = this.buyHand;
            this.earn += todayEarn;
            this.totalCash[date] = this.currentCash += todayEarn;
        }
    }

    show() {
        console.log(`need max hand is [${this.maxBuyHand}] and current earn [${this.earn}]`);
        console.log(``);
        console.log('log ------------------ ');
        console.log(this.log.join('\r\n'));
    }

    writeOutBuySeal(line,fromYear,noWriteOut = false) {
        let series = [
            {
                name: '买入',
                yAxisIndex: 0,
                symbolSize: 10,
                data: [
                    // ['2017-10-27',10]
                ],
                color: 'red',
                type: 'scatter'
            },
            {
                name: '卖出',
                yAxisIndex: 0,
                symbolSize: 10,
                data: [],
                color: 'blue',
                type: 'scatter'
            },
            {
                name: 'k 线',
                yAxisIndex: 0,
                type: 'k',
                data: []
            },
            {
                yAxisIndex: 1,
                type: 'line',
                name: '持有',
                data: [],
                color: '#675bba'
            },
            {
                yAxisIndex: 2,
                type: 'line',
                name: '持有余额',
                data: [],
                color: '#096'
            }
        ];
        let xAxis = [];
        this.buy.forEach(buy => {
            series[0].data.push([buy.date,buy.price]);
        });
        this.seal.forEach(seal => {
            series[1].data.push([seal.date,seal.price]);
        });
        let lastTimeHas = 0;
        let maxHas = 0;
        let lastTimeTotalCash = this.startCash;
        let minTotalCash = this.startCash / 100;
        let maxTotalCash = this.startCash;
        let stockMax = -1;
        let stockMin = 10000000000;
        line.forEach(l => {
            if (+l[0].substring(0,4) >= fromYear) {
                series[2].data.push([+l[1],+l[2],+l[3],+l[4]]);
                stockMax = stockMax < l[3] ? l[3] : stockMax;
                stockMin = stockMin > l[4] ? l[4] : stockMin;
                xAxis.push(l[0]);
                lastTimeHas = l[0] in this.has ? this.has[l[0]] : lastTimeHas;
                series[3].data.push(lastTimeHas);
                maxHas = maxHas < lastTimeHas ? lastTimeHas : maxHas;
                lastTimeTotalCash = l[0] in this.totalCash ? this.totalCash[l[0]] : lastTimeTotalCash;
                series[4].data.push((lastTimeTotalCash / 100).toFixed(4));
                maxTotalCash = maxTotalCash < lastTimeTotalCash ? lastTimeTotalCash : maxTotalCash;
            }
        });
        let legend = [];
        series.forEach(s => {
            legend.push(s.name);
        });
        let option = {
            xAxis: {
                data: xAxis
            },
            legend: {
                data: legend,
                selected: {
                    '持有': false
                }
            },
            dataZoom: [
                {
                    type: 'slider',
                    xAxisIndex: 0,
                    filterMode: 'empty'
                },
                {
                    type: 'inside',
                    xAxisIndex: 0,
                    filterMode: 'empty'
                },
            ],
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'cross'
                }
            },
            yAxis: [
                {
                    name: '价格(元)',
                    type: 'value',
                    min: (stockMin * 0.9).toFixed(2),
                    max: (stockMax * 1.1).toFixed(2)
                },
                {
                    type: 'value',
                    name: '持有(手)',
                    min: 0,
                    max: maxHas * 1.1
                },
                {
                    offset: 80,
                    type: 'value',
                    name: '持有余额(万元)',
                    min: (minTotalCash * 0.9).toFixed(4),
                    max: (maxTotalCash / 100 * 1.1).toFixed(4)
                }
            ],
            series: series
        };
        option.yAxis[1].max = this.maxBuyHand + 10;
        noWriteOut ? '' : fs.writeFileSync('option.js',`const option = ` + JSON.stringify(option));
        return option;
    }
}

module.exports = Dear;