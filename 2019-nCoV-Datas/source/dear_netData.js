const fs = require('fs');
const netDataPath = './netData/';
const savePath = './../datas/';
const code = require('./../ToTestMyData/checkWith-2019-wuhan-coronavirus-data/netDataJson.json');
const toMyJsonFileName = (filename) => {
    return [filename.substring(0,4),
        '-',filename.substring(4,6),'-',
        filename.substring(6)].join('').replace('.json','.txt');
};
fs.readdirSync(netDataPath)
    .filter(_ => _.endsWith('.json'))
    .forEach(f => {
        let out = [];
        require(netDataPath + f)
            .forEach(province => {
                let cout = [];
                cout[0] = code[province.provinceName];
                cout[1] = province.provinceName;
                if (province.provinceName === "吉林省") {
                    cout[0] = 220000;
                    cout[1] = province.provinceName;
                }
                cout[2] = province.confirmedCount;
                cout[3] = province.suspectedCount;
                cout[4] = province.curedCount;
                cout[5] = province.deadCount;
                out.push(cout);
                province.cities.forEach(city => {
                    cout = [];
                    cout[0] = code[city.cityName];
                    cout[1] = city.cityName;
                    if (city.cityName === "吉林") {
                        cout[1] = "吉林市";
                        cout[0] = 220200;
                    }
                    cout[2] = city.confirmedCount;
                    cout[3] = city.suspectedCount;
                    cout[4] = city.curedCount;
                    cout[5] = city.deadCount;
                    out.push(cout);
                });
            });
        fs.writeFileSync(savePath + toMyJsonFileName(f),out.map(_ => _.join(',')).join('\r\n'),'utf-8');
    });
