// 下载失败重试
const {
    getDayBetweenFromYearFirstDay   // 获取某一天距离新年第一天(1月1日)多少天
} = require('../../_utils/getDays');
const account = require('../../sources/nasaCount.json');
let fs = require('fs');

// if not exist GLDAS_NOAH025_3H.A20030201.0000.021.nc4 wget --no-check-certificate --load-cookies
// urs_cookies --save-cookies urs_cookies --auth-no-challenge=on --keep-session-cookies --user=username
// --password=password --content-disposition
// https://hydro1.gesdisc.eosdis.nasa.gov/data/GLDAS/GLDAS_NOAH025_3H.2.1/2003/032/GLDAS_NOAH025_3H.A20030201.0000.021.nc4
let del = "";
let userName = account.username;
let password = account.password;
let filenames = [];
let files = fs.readFileSync('./check.txt','utf-8').split(/\n/g)
// let files = fs.readFileSync('./GLDAS_NOAH025_NO_EXIST.txt','utf-8').split(/\n/g)
    .filter(_ => _.startsWith('[chck_error]')).map(_ => _.trim())
    .map(file => {
        // file = Z:\2020_download_data\SoilMoisture\GLDAS_NOAH025_3H.A20141231.0900.021.nc4
        let fsp = file.split('\\');
        if (1 === fsp.length) {
            fsp = file.split('/');
        }
        // fsp = GLDAS_NOAH025_3H.A20141231.0900.021.nc4;
        fsp = fsp[fsp.length - 1];
        let fnsp = fsp.split('.');
        fnsp = fnsp[1].substring(1);
        del += `del "${fsp}"\r\n`;
        let ds = getDayBetweenFromYearFirstDay(fnsp) + 1;
        filenames.push(fsp);
        return [
            `if not exist ${fsp} wget --no-check-certificate --load-cookies`,
            ` urs_cookies --save-cookies urs_cookies --auth-no-challenge=on --keep-session-cookies --user=${userName}`,
            ` --password=${password} --content-disposition`,
            ` https://hydro1.gesdisc.eosdis.nasa.gov/data/GLDAS/GLDAS_NOAH025_3H.2.1/${fnsp.substring(0,4)}/${(getDayBetweenFromYearFirstDay(fnsp) + 1).toLength(3)}/${fsp}`
        ].join('');
    }).join('\r\n');

fs.writeFileSync('./re_download_fs.bat',files,'utf-8');
fs.writeFileSync('./del.bat',del,'utf-8');
fs.writeFileSync('./fail_to_download_nc4.txt',filenames.join("\r\n"),'utf-8');