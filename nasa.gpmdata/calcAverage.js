const fs = require('fs');
const path = require('path');

// 计算土壤的一天平均值
function calcAverage() {
    let dic = {};
    fs.readdirSync('U:\\jiayu\\SoilMoisture_tif')
        .filter(_ => _.endsWith('.tif'))
        .forEach(_ => {
            let f = path.basename(_).split('.');
            if (f[1] in dic) {
                dic[f[1]].push(_);
            } else {
                dic[f[1]] = [_];
            }
        });
    let cmd = "";
    for (let i in dic) {
        cmd += `"C:\\Users\\HUZENGYUN\\Documents\\git\\cshap\\iGeospatial-master\\Version 1.1\\Open\\PackageR\\bin\\Release\\PackageR.exe" CalcBandGetAverage "U:\\jiayu\\SoilMoisture_tif_average\\${i}.tif" 1#2#3 ${(function () {
            let t = "";
            dic[i].forEach(tif => {
                t += `"U:\\jiayu\\SoilMoisture_tif\\${tif}" `;
            });
            return t;
        })()}\r\n`
    }
    fs.writeFileSync("U:\\jiayu\\SoilMoisture_tif\\average.bat",cmd);
}

// 计算降水一个月的和
function calcJIANGSHUISum() {
    let dic = {};
    fs.readdirSync("U:\\jiayu\\GMP_TIF")
        .filter(_ => _.endsWith('.tif'))
        .forEach(_ => {
            let d = _.split('.')[4].substring(0,6);
            if (d in dic) {
                dic[d].push(_);
            } else {
                dic[d] = [_];
            }
        });
    let cmd = "";
    for (let i in dic) {
        cmd += `"C:\\Users\\HUZENGYUN\\Documents\\git\\cshap\\iGeospatial-master\\Version 1.1\\Open\\PackageR\\bin\\Release\\PackageR.exe" CalcBandGetSum "U:\\jiayu\\GMP_TIF\\Sum\\${i}.tif" 1 ${(function () {
            let t = "";
            dic[i].forEach(tif => {
                t += `"U:\\jiayu\\GMP_TIF\\${tif}" `;
            });
            return t;
        })()}\r\n`
    }
    fs.writeFileSync("U:\\jiayu\\GMP_TIF\\Sum\\sum.bat",cmd);
}
calcJIANGSHUISum();