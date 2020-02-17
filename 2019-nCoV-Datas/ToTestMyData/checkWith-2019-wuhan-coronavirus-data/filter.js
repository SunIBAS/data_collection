const fs = require('fs')

let file = {
	/*date: {
		time: 003200,
		filename: ''
	}*/
};

// 将该文件放到 2019-wuhan-coronavirus-data\data-sources\dxy\data 目录下，执行 node filter
fs.readdirSync("./")
	.filter(_ => _.endsWith('.json'))
	.forEach(fi => {
		let ret = fi.split('-').splice(0,2).map(_ => parseInt(_));
		if (ret[0] in file) {
			if (file[ret[0]].time < ret[1]) {
				file[ret[0]].time = ret[1];
				file[ret[0]].filename = fi;
			}
		} else {
			file[ret[0]] = {
				time: ret[1],
				filename: fi
			};
		}
	});

let cmd = [];
for (let i in file) {
	cmd.push(`copy ${file[i].filename} last\\${i}.json`);
}
console.log(cmd.join('\r\n'))
