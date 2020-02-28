require('./formatNumber');
const fs = require('fs');
const path = require('path');

function sortDir(dirPath) {
    let files = [];
    fs.readdirSync(dirPath)
        .forEach(f => {
            let s = fs.statSync(path.join(dirPath,f));
            if (f.length > 10 && s.isFile()) {
                files.push([f,s.mtimeMs]);
            }
        });
    return files.sort((a,b) => a[1] - b[1]).map(_ => _[0]);
}

function toRename(dirPath) {
    let f = sortDir(dirPath);
    let len = (f.length + '').length;
    f.forEach((_f,_ind) => {
        console.log(_ind.toLength(len) + '\t' + _f);
        try {
            fs.renameSync(path.join(dirPath,_f),path.join(dirPath,_ind.toLength(len) + ''))
        } catch (e) {
            console.log(e);
        };
    });
}

function toMakeAllChildFolder(dirPath) {
    fs.readdirSync(dirPath)
        .forEach(f => {
            let s = fs.statSync(path.join(dirPath,f));
            if (f.length > 10 && s.isDirectory()) {
                toRename(path.join(dirPath,f));
            }
        });
}

function renameExt(dirPath,ext) {
    fs.readdirSync(dirPath)
        .forEach(f => {
            let s = fs.statSync(path.join(dirPath,f));
            if (s.isFile()) {
                fs.renameSync(path.join(dirPath,f),path.join(dirPath,f + ext))
            }
        });
}

function toRenameAllChildFolder(dirPath,ext) {
    fs.readdirSync(dirPath)
        .forEach(f => {
            let s = fs.statSync(path.join(dirPath,f));
            if (f.length > 10 && s.isDirectory()) {
                renameExt(path.join(dirPath,f),ext);
            }
        });
}

// toRenameAllChildFolder("C:\\Users\\HUZENGYUN\\Documents\\temp",'.ts');