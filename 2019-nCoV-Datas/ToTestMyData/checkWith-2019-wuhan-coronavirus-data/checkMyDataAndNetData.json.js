const code = require('./../../source/others/cityCode.json');
const fs = require('fs');

const getProvinceName = (name) => {
    const _name = {
        "澳门": "澳门特别行政区",
        "台湾": "台湾省",
        "香港": "香港特别行政区",
    };
    if (name in _name) {
        return _name[name];
    } else {
        return name;
    }
};

const check = (netDataJson,myDataJson) => {
    //const netDataJson = "20200205";
    //const myDataJson = "2020-02-05";

    const netData = require(`./../../test/sources/${netDataJson}`);
    const myData = require(`./../../data_json/${myDataJson}`);
    const myDataProvince = {};
    const netDataProvince = {};
    let keys = [];
    netData.forEach(d => {
        keys.push(code.province2Code[getProvinceName(d.provinceName)]);
        netDataProvince[code.province2Code[getProvinceName(d.provinceName)]] = d.confirmedCount;
    });
    for (let i in myData) {
        if (i !== "000000" && (i + '').substring(2) === "0000") {
            if (-1 === keys.indexOf(i)) {
                keys.push(i);
            }
            myDataProvince[i] = myData[i][2];
        }
    }

    console.log(`=============> check file ${netDataJson} <===============`);
    keys.forEach(key => {
        if (!(key in myDataProvince)) {
            console.log(`${key} -> ${code.code2Province[key]} -> not in [my] data`);
        }
        else if (!(key in netDataProvince)) {
            console.log(`${key} -> ${code.code2Province[key]} -> not in [net] data`);
        } else {
            if (parseInt(myDataProvince[key] || '0') - parseInt(netDataProvince[key] || '0') !== 0) {
                console.log(`${key} -> ${code.code2Province[key]} has different`);
                console.log(`\tmydata = ${myDataProvince[key]} netdata = ${netDataProvince[key]}`);
            }
        }
    });
};

fs.readdirSync('./../../test/sources').forEach(file => {
    check(file,
        `${file.substring(0,4)}-${file.substring(4,6)}-${file.substring(6)}`);
});