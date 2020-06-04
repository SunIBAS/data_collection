const {
    getDayBetween
} = require('./../_utils/getDays');
const fs = require('fs');

let out = [];

fs.readFileSync("./SoilMoisture.txt",'utf-8')
    .split(/[\r\n]/)
    .map(_ => _.trim())
    .filter(_ => _)
    .forEach(_ => {
        let d = _.split('.')[1].substring(1);
        let b = 1 - getDayBetween(d.substring(0,4) + "0101",d);
        out.push(`del ${_}`);
        out.push(`wget --load-cookies urs_cookies --save-cookies urs_cookies --auth-no-challenge=on --keep-session-cookies --user=刚刚注册的用户名 --password=刚刚注册的密码 --content-disposition https://hydro1.gesdisc.eosdis.nasa.gov/data/GLDAS/GLDAS_NOAH025_3H.2.1/${d.substring(0,4)}/${b.toLength(3)}/${_}`)
    });

// GLDAS_NOAH025_3H.A20190813.0300.021.nc4
// wget --load-cookies urs_cookies --save-cookies urs_cookies --auth-no-challenge=on
// --keep-session-cookies --user=刚刚注册的用户名 --password=刚刚注册的密码 --content-disposition
// https://hydro1.gesdisc.eosdis.nasa.gov/data/GLDAS/GLDAS_NOAH025_3H.2.1/2010/001/GLDAS_NOAH025_3H.A20100101.0000.021.nc4
//console.log(1 - getDayBetween("20190101","20191130"));

fs.writeFileSync('./recover.bat',out.join("\r\n"));