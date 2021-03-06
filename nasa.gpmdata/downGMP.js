const {
    getFromDay,
    getDayBetweenFromYearFirstDay
} = require('../_utils/getDays');
require('../_utils/formatNumber');
const fs = require('fs');

let nd = getFromDay(2020,4,1,false,true);
let d;
let out = [];
let emailAndPassword = "我用的是谷歌的邮箱，默认密码就是邮箱";
let getCmd = (day,type) => {
    let d = (getDayBetweenFromYearFirstDay(day) * 30).toLength(4);
    let filename = `3B-DAY-GIS.MS.MRG.3IMERG.${day}-S000000-E235959.${d}.V06B.${type}`;
    return `if not exist ${filename} wget 
    ftp://arthurhou.pps.eosdis.nasa.gov/gpmdata/${day.substring(0,4)}/${day.substring(4,6)}/${day.substring(6)}/gis/${filename} 
    --ftp-user=${emailAndPassword} 
    --ftp-password=${emailAndPassword}`
        .split(/[\r\n]/)
        .map(_ => _.trim())
        .filter(_ => _)
        .join(' ');
};
d = nd();
while (d) {
    out.push(getCmd(d,'tfw'));
    out.push(getCmd(d,'tif'));
    out.push(getCmd(d,'zip'));
    d = nd();
}

fs.writeFileSync('bat.bat',"chcp 65001\r\n" + out.join('\r\n'),'utf-8');