// 计算每个月的平均值
const fs = require('fs');
const packageRPath = "C:\\Users\\admin\\Desktop\\tmp\\PackageR\\PackageR.exe";
const currentTifPath = "S:\\2020_download_data\\SoilMoisture_tif\\";
const TifPath = "Z:\\2020_download_data\\SoilMoisture_tif\\";
const saveTifPath = "Z:\\2020_download_data\\SoilMoisture_month_avg\\";

const getMonthDay = function(yd) {
    let year = yd.substring(0,4);
    let month = yd.substring(4,6);
    let day = yd.substring(6);
    return {
        month: year + "_" + month,
        day: year + "_" + month + "_" + day
    };
};

let files = {
    // "2020_01": { "2020_01_01": ["GLDAS_NOAH025_3H.A2020001.0000.021.nc4.tif"] }
};
//
let mFiles = {
    "01": ["2020_01","2019_01"]
};
fs.readdirSync(currentTifPath)
    .filter(_ => _.trim())
    .filter(_ => _.endsWith('.nc4.tif'))
    .forEach(f => {
        // f = GLDAS_NOAH025_3H.A20030201.0000.021.nc4.tif
        let yd = getMonthDay(f.split('.')[1].substring(1));
        if (yd.month in files) {} else {
            files[yd.month] = {};
        }
        if (yd.day in files[yd.month]) {} else {
            files[yd.month][yd.day] = [];
        }
        files[yd.month][yd.day].push(f);
    });
let toCmd = (arr,t,tp) => {
    return `${packageRPath} CalcBandGetAverage "${t}.tif" 1#2#3 ${(function () {
        let c = "";
        arr.forEach(a => {
            c += `${tp ? tp : TifPath}${a} `;
        });
        return c;
    })()}\r\n`
}
let cmds = "";
for (let m in files) {
    let ds = [];
    for (let d in files[m]) {
        cmds += toCmd(files[m][d],saveTifPath + d);
        ds.push(d + ".tif");
    }
    cmds += toCmd(ds,saveTifPath + m,saveTifPath);
    cmds += ds.map(_ => {
        return 'del ' + saveTifPath + _ + "\r\n";
    }).join('');
    let _m = m.split("_")[1];
    if (_m in mFiles) {} else {
        mFiles[_m] = [];
    }
    mFiles[_m].push(m + ".tif");
}
cmds += "::calc all month to one month\r\n";
for (let i in mFiles) {
    cmds += toCmd(mFiles[i],saveTifPath + i,saveTifPath);
}
fs.writeFileSync("do.bat",cmds);