const fs = require('fs');
const codes = require('./others/cityCode.json');
const cityNameChange = require('./changeName.js').cityNameChange;

let data = {};
fs.readFileSync("all.txt","utf-8")
    .split(/[\r\n]/).map(_ => _.split(','))
    .filter(_ => _[1] === "中国")
    .forEach(_ => {
        if (_[0] in data) {} else {
            data[_[0]] = [];
        }
        data[_[0]].push(_);
    });

let out = [];
let nextDate = (d) => {
    let d_list = [ '2019-12-01',
        '2019-12-02',
        '2019-12-03',
        '2019-12-04',
        '2019-12-05',
        '2019-12-06',
        '2019-12-07',
        '2019-12-08',
        '2019-12-09',
        '2019-12-10',
        '2019-12-11',
        '2019-12-12',
        '2019-12-13',
        '2019-12-14',
        '2019-12-15',
        '2019-12-16',
        '2019-12-17',
        '2019-12-18',
        '2019-12-19',
        '2019-12-20',
        '2019-12-21',
        '2019-12-22',
        '2019-12-23',
        '2019-12-24',
        '2019-12-25',
        '2019-12-26',
        '2019-12-27',
        '2019-12-28',
        '2019-12-29',
        '2019-12-30',
        '2019-12-31',
        '2020-01-01',
        '2020-01-02',
        '2020-01-03',
        '2020-01-04',
        '2020-01-05',
        '2020-01-06',
        '2020-01-07',
        '2020-01-08',
        '2020-01-09',
        '2020-01-10',
        '2020-01-11',
        '2020-01-12',
        '2020-01-13',
        '2020-01-14',
        '2020-01-15',
        '2020-01-16',
        '2020-01-17',
        '2020-01-18',
        '2020-01-19',
        '2020-01-20',
        '2020-01-21',
        '2020-01-22',
        '2020-01-23',
        '2020-01-24',
        '2020-01-25',
        '2020-01-26',
        '2020-01-27',
        '2020-01-28',
        '2020-01-29',
        '2020-01-30',
        '2020-01-31',
        '2020-02-01',
        '2020-02-02',
        '2020-02-03',
        '2020-02-04',
        '2020-02-05',
        '2020-02-06',
        '2020-02-07',
        '2020-02-08',
        '2020-02-09',
        '2020-02-10' ];
    return d_list[d_list.indexOf(d) + 1];
};
for (let i in data) {
    out = [
        ["flag","area","confirmed","suspected","cured","dead"]
    ];
    data[i].forEach(d => {
        if (d[5]) {
            let name = codes.code2Name[d[4]][d[6]];
            if (!name) {
                // 注意他的东宁市 宁夏的，但是cityCode中的东宁市是黑龙江的
                switch (d[5]) {
                    case "第七师":
                        d[6] = 654003;
                        name = codes.code2Name[d[4]][d[6]];
                        break;
                    case "第八师石河子市":
                        d[6] = 659001;
                        name = codes.code2Name[d[4]][d[6]];
                        break;
                    case "兴安盟乌兰浩特":
                        d[6] = 152200;
                        name = codes.code2Name[d[4]][d[6]];
                        break;
                    case "长垣市":
                        d[6] = 410728;
                        name = codes.code2Name[d[4]][d[6]];
                        break;
                    default:
                        console.log(d.join('\t'));
                }
            }
            out.push([
                d[6] || "-1",name || d[5],
                d[7],d[8],d[9],d[10]
            ]);
        } else if (d[3]) {
            out.push([
                d[4],d[3],
                d[7],d[8],d[9],d[10]
            ]);
        } else {
            out.push([
                "000000",d[1],
                d[7],d[8],d[9],d[10]
            ]);
        }
    });
    if (i === '2020-01-20') {
        `420100,武汉市,258,0,27,3
421100,黄冈市,12,0,0,0`.split(/[\r\n]/).filter(_ => _)
            .forEach(line => {
                let o = [];
                line.split(',').forEach(_ => o.push(_));
                out.push(o);
            });
    } else if (i === "2020-01-21") {
        `420100,武汉市,343,0,27,3
421100,黄冈市,12,0,0,0`.split(/[\r\n]/).filter(_ => _)
            .forEach(line => {
                let o = [];
                line.split(',').forEach(_ => o.push(_));
                out.push(o);
            });
    } else if (i === "2020-01-22") {
        `420100,武汉市,405,0,27,11
421100,黄冈市,12,0,0,0
420800,荆门市,1,0,0,0
421000,荆州市,6,0,0,0`.split(/[\r\n]/).filter(_ => _)
            .forEach(line => {
                let o = [];
                line.split(',').forEach(_ => o.push(_));
                out.push(o);
            });
    }
    out.sort((a,b) => parseInt(a) - parseInt(b));
    fs.writeFileSync(`../datas/${nextDate(i)}.txt`,out.filter(_ => _.length > 2).map(_ => {
        if (!_.join) {
            return '';
        }
        return _.join(',');
    }).join('\r\n'));
}

