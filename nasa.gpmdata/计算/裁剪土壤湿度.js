const fs = require('fs');
const path = require('path');

const clipCmd = (source,target) => `gdalwarp --config GDAL_DATA "C:\\Program Files\\GDAL\\gdal-data" --config GDALWARP_IGNORE_BAD_CUTLINE YES --config GDAL_DATA "C:\\\\Program Files\\\\GDAL\\\\gdal-data"  --config GDAL_FILENAME_IS_UTF8 YES --config SHAPE_ENCODING UTF-8 -crop_to_cutline -cutline "Z:\\2020_download_data\\clip_shp_file\\Aral_Sea_merge.shp"  -multi -wo NUM_THREADS=ALL_CPUS  -r near -overwrite "${source}" "${target}"`;

const tifPath = `Z:\\2020_download_data\\SoilMoisture_tif`;
const targetPath = `Z:\\2020_download_data\\SoilMoisture_tif_clip`;

const cmds = [];

fs.readdirSync(tifPath).filter(_ => _.endsWith('.tif'))
    .filter(_ => _.split('.')[1].substring(1,5) >= 2015)
    .forEach(tif => {
        cmds.push(clipCmd(path.join(tifPath,tif),path.join(targetPath,tif)));
    });

fs.writeFileSync('dear_SM.cmd',cmds.join('\r\n'));