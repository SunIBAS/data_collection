const fs = require('fs');
const {
    getFromDay,
    getDayBetweenFromYearFirstDay
} = require('./../_utils/getDays');

const packageRPath = "D:\\codes\\cshap\\iGeospatial-master\\Version 1.1\\Open\\PackageR\\bin\\Release\\PackageR.exe";
const savePath = "Z:\\2020_download_data\\SoilMoisture_tif_clip\\average";
const sourcePath = "Z:\\2020_download_data\\SoilMoisture_tif_clip"

let year = 2018;
let nd = getFromDay(year,1,1,false,false,year,12,31);// 迭代获取时间，从 year-0101 开始到 year-1231 为止

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
    mapper[fd].push(`GLDAS_NOAH025_3H.A${d}.0000.021.nc4.tif`);
    mapper[fd].push(`GLDAS_NOAH025_3H.A${d}.0300.021.nc4.tif`);
    mapper[fd].push(`GLDAS_NOAH025_3H.A${d}.0600.021.nc4.tif`);
    mapper[fd].push(`GLDAS_NOAH025_3H.A${d}.0900.021.nc4.tif`);
    mapper[fd].push(`GLDAS_NOAH025_3H.A${d}.1200.021.nc4.tif`);
    mapper[fd].push(`GLDAS_NOAH025_3H.A${d}.1500.021.nc4.tif`);
    mapper[fd].push(`GLDAS_NOAH025_3H.A${d}.1800.021.nc4.tif`);
    mapper[fd].push(`GLDAS_NOAH025_3H.A${d}.2100.021.nc4.tif`);
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
    let last1 = "a0 = (aa0";
    let last2 = "b0 = (bb0";
    let last3 = "c0 = (cc0";
    let last4 = "d0 = (dd0";
    mapper[i].forEach((tif,ind) => {
        lcmds.push(`aa${ind} = raster("${sourcePath}\\${tif}",band=1)`);
        lcmds.push(`bb${ind} = raster("${sourcePath}\\${tif}",band=2)`);
        lcmds.push(`cc${ind} = raster("${sourcePath}\\${tif}",band=3)`);
        lcmds.push(`dd${ind} = raster("${sourcePath}\\${tif}",band=4)`);
        if (ind) {
            last1 += '+aa' + ind;
            last2 += '+bb' + ind;
            last3 += '+cc' + ind;
            last4 += '+dd' + ind;
        }
    });
    last1 += ") / " + mapper[i].length + ';';
    last2 += ") / " + mapper[i].length + ';';
    last3 += ") / " + mapper[i].length + ';';
    last4 += ") / " + mapper[i].length + ';';
    cmds = cmds.concat(lcmds);
    cmds.push(last1);
    cmds.push(last2);
    cmds.push(last3);
    cmds.push(last4);
    cmds.push(`writeRaster(stack(a0,b0,c0,d0),"${savePath}\\${i}.tif",overwrite=TRUE);`)
    cmds.push('');
}

fs.writeFileSync(`average_sm_${year}.r`,cmds.join('\r\n').replace(/\\/g,'\\\\'));

