const fs = require('fs');
const path = require('path');

const jsonPath = './管控区';

let dates = [];
let options = {
    /*'gd': {
        '防空区': [1]
    },*/
};
let zeros = [];
let tags = ["中风险场所","管控区","防范区","封控区","高风险场所","提级管理区"];
let provinces = {};

fs.readdirSync(jsonPath).filter(_ => _.endsWith('.json')).forEach((f,ind) => {
    zeros.push(0);
    dates.push(
        f.split('.')[0]
            .split('_')
            .map(_ => _.length === 1 ? `0${_}` : _)
            .join('')
    );
    let json = require(`${jsonPath}/${f}`);
    for (let i in json) {
        let province = i.split('_');
        if (province.length === 2) {
            if (!(province[0] in provinces)) {
                provinces[province[0]] = ['全市',province[1]];
            } else {
                if (!provinces[province[0]].includes(province[1])) {
                    provinces[province[0]].push(province[1]);
                }
            }
        } else {
            provinces[province[0]] = ['全市'];
        }
        if (!(i in options)) {
            options[i] = {};
        }
        json[i].data.forEach(d => {
            let tag = d.x.tags;
            // if (!tags.includes(tag)) tags.push(tag);
            if (!(tag in options[i])) {
                options[i][tag] = zeros.slice(1);
                options[i][tag].push(1)
            } else {
                if (options[i][tag].length - 1 === ind) {
                    options[i][tag][ind]++;
                } else {
                    options[i][tag].push(0);
                }
            }
        })
    }
});

console.log(zeros.length)
for (let i in options) {
    for (let j in options[i]) {
        if (options[i][j].length !== zeros.length) {
            options[i][j] = [].concat(options[i][j],zeros.slice(options[i][j].length));
        }
    }
}
console.log(`options = ${JSON.stringify(options)};`);
console.log(`dates = ["${dates.join('","')}"];`);
console.log(`tags = ["${tags.join('","')}"];`);

let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>运行{管控区变化摘要}后获得</title>
    <script src="echarts.min.js"></script>
    <style>
        body {
            padding: 0;
            margin: 0;
            border: none;
            overflow: hidden;
        }
        #echart {
            width: 100vw;
            height: calc(100vh - 50px);
         }
        #option {
            height: 50px;
        }
    </style>
</head>
<body>
    <div id="option">
        <select id="province" onchange="provinceChange(this)"></select>
        <select id="city"></select>
        <button onclick="draw()">提交</button>
    </div>
    <div id="echart"></div>
</body>
<script>
window.options = ${JSON.stringify(options)};
window.dates = ["${dates.join('","')}"];
window.tags = ["${tags.join('","')}"];
window.showArea = '上海市';
window.getOption = (datas,showArea) => {
    let ts = [];
    for (let i in datas) {
        ts.push(i);
    }
    return {
    title: {
        text: showArea + '_疫情数据'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    legend: {
        data: ts
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            data: dates
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: (() => {
        let ss = [];
        for (let i in datas) {
            ss.push({
                name: i,
                type: 'line',
                stack: 'Total',
                areaStyle: {},
                emphasis: {
                    focus: 'series'
                },
                data: datas[i]
            });
        }
        return ss;
    })(),
}};
window.provinces = ${JSON.stringify(provinces)};
</script>
<script>
    window.provinceChange = function (e) {
        console.log(e.value);
        if (e.value in window.provinces) {
            document.getElementById('city').innerHTML = window.provinces[e.value].map(_ => \`<option value="\${_}">\${_}</option>\`);
        } else {
            document.getElementById('city').innerHTML = '<option>-</option>';
        }
}
    window.ec = null;
    window.onload = function () {
        let provinceOptions = ['全国'];
        for (let i in provinces) {
            provinceOptions.push(i);
        }
        document.getElementById('province').innerHTML = provinceOptions.map(_ => \`<option value="\${_}">\${_}</option>\`);
        window.ec = echarts.init(document.getElementById('echart'));
        // ec.setOption(window.getOption(window.showArea));
        window.draw();
    }
    window.draw = function () {
        let province = document.getElementById('province').value;
        let city = document.getElementById('city').value;
        let nameChecker = _ => _;
        let provinceName = \`\`;
        if (province === '全国') {
            provinceName = "全国";
        } else if (province in provinces && city === '全市') {
            provinceName = province;
            nameChecker = name => name.startsWith(province);
        } else {
            provinceName = province + '_' + city;
            nameChecker = name => name === \`\${province}_\${city}\`;
        }
        let d = {}
        for (let i in options) {
            if (!nameChecker(i)) {
                continue;
            }
            for (let j in options[i]) {
                if (!(j in d)) {
                    d[j] = options[i][j];
                } else {
                    d[j] = d[j].map((_d,_ind) => _d + options[i][j][_ind]);
                }
            }
        }
        window.ec.setOption(getOption(d,provinceName),true);
    };
</script>
</html>;`

fs.writeFileSync('./管控区图表/index.html',html,'utf-8');

