const netDataJson = require('./netDataJson.json');
const fs = require('fs');
const basePath = './../../test/sources/';

fs.readdirSync(basePath)
    .filter(_ => _.endsWith('.json'))
    .forEach(file => {
        let json = require(basePath + file);
        console.log(`file : ${file}`);
        json.forEach(province => {
            if (province.provinceName in netDataJson) {
                province.cities.forEach(city => {
                    if (city.cityName in netDataJson) {} else {
                        console.log(`\t\tcityNameUnkonw ${city.cityName}`);
                    }
                });
            } else {
                console.log(`\tprovinceNameUnkonw ${province.provinceName}`);
            }
        })
    });