const spawn = eval('require')('child_process').spawn;
const {
    root
} = require('./basePath');
let converter = function(filename) {
    console.log("dear" + filename);
    let command = `"${root}\\converter.exe" "${filename}" ${filename}`;
    console.log(command);
    spawn(command, {
        shell: true,
    });
};


module.exports = {
    converter
};