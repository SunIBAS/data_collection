// https://zenodo.org/record/5502275#.YYs4XG1ByUl

// var url = 'https://zenodo.org/record/5502275/files/1981_max.zip?download=1';

var urls = [];
for (var i = 1982;i < 2019;i++) {
    urls.push(`https://zenodo.org/record/5502275/files/${i}_avg.zip?download=1`);
    urls.push(`https://zenodo.org/record/5502275/files/${i}_min.zip?download=1`);
    urls.push(`https://zenodo.org/record/5502275/files/${i}_max.zip?download=1`);
}

var downloading = false;
var nexter = () => {
    if (downloading) {
        return
    } else {
        downloading = true;
        var url = urls.pop();
        var win = window.open(url);
        var winid = setInterval(() => {
            if (win.closed) {
                setTimeout(() => {
                    downloading = false;
                },1000 * 60 * 3);
                clearInterval(winid);
            }
        },500);
    }
};

var id = setInterval(function() {
    if (urls.length) {
        nexter();
    } else {
        console.log("over");
        clearInterval(id);
    }
},1000);
