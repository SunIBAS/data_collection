const fs = require('fs');
const {
    getFromDay,
    getDayBetweenFromYearFirstDay
} = require('./../_utils/getDays');

const packageRPath = "D:\\codes\\cshap\\iGeospatial-master\\Version 1.1\\Open\\PackageR\\bin\\Release\\PackageR.exe";
const savePath = "Z:\\2020_download_data\\PPS_clip\\PPS_8_AVERAGE";
const sourcePath = "Z:\\2020_download_data\\PPS_clip"

let nd = getFromDay(2015,1,1,false,false,2018,12,31);// 迭代获取时间，从 20150101 开始到 20181231 为止

let mapper = {
    // "2015001": [0 = "3B-DAY-GIS.MS.MRG.3IMERG.20150101-S000000-E235959.4560.V06B.tif"
    // 1 = "3B-DAY-GIS.MS.MRG.3IMERG.20150102-S000000-E235959.4560.V06B.tif"
    // 2 = "3B-DAY-GIS.MS.MRG.3IMERG.20150103-S000000-E235959.4560.V06B.tif"
    // 3 = "3B-DAY-GIS.MS.MRG.3IMERG.20150104-S000000-E235959.4560.V06B.tif"
    // 4 = "3B-DAY-GIS.MS.MRG.3IMERG.20150105-S000000-E235959.4560.V06B.tif"
    // 5 = "3B-DAY-GIS.MS.MRG.3IMERG.20150106-S000000-E235959.4560.V06B.tif"
    // 6 = "3B-DAY-GIS.MS.MRG.3IMERG.20150107-S000000-E235959.4560.V06B.tif"
    // 7 = "3B-DAY-GIS.MS.MRG.3IMERG.20150108-S000000-E235959.4560.V06B.tif"]
};

function buildMapper(d) {
    let fd = (getDayBetweenFromYearFirstDay(d));
    fd = d.substring(0,4) + (parseInt(fd / 8) * 8 + 1).toLength(3);
    if (!(fd in mapper)) {
        mapper[fd] = [];
    }
    let ddd = (getDayBetweenFromYearFirstDay(d) * 30).toLength(4);
    mapper[fd].push(`3B-DAY-GIS.MS.MRG.3IMERG.${d}-S000000-E235959.${ddd}.V06B.tif`);
}

for (;true;) {
    d = nd();
    if (d) {
        buildMapper(d);
    } else {
        break;
    }
}

let cmds = [];

for (let i in mapper) {
    let lcmds = [];
    let last = "o0 = (t0";
    mapper[i].forEach((tif,ind) => {
        lcmds.push(`t${ind} = raster("${sourcePath}\\${tif}",band=1)`);
        if (ind) {
            last += '+t' + ind;
        }
    });
    last += ") / " + mapper[i].length + ';';
    cmds = cmds.concat(lcmds);
    cmds.push(last);
    cmds.push(`writeRaster(stack(o0),"${savePath}\\${i}.tif",overwrite=TRUE);`)
    cmds.push('');
}

fs.writeFileSync('average.r',cmds.join('\r\n').replace(/\\/g,'\\\\'));

