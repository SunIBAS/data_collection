// http://wjw.sz.gov.cn/yqxx/index.html
var getPageLink = page => {
    if (page === 1) {
        return `http://wjw.sz.gov.cn/yqxx/index.html`;
    } else {
        return `http://wjw.sz.gov.cn/yqxx/index_${page}.html`;
    }
}

var fetchPage = page => {
    return fetch(getPageLink(page)).then(_ => _.text()).then(r => {
        let d = document.createElement('div');
        d.innerHTML = r;
        let okAs = [];
        let as = d.getElementsByClassName('AllListCon')[0].getElementsByTagName('a');
        for (var i = 0;i < as.length;i++) {
            if (/[0-9]+年[0-9]+月[0-9]+日深圳市新冠肺炎疫情情况/.test(as[i].innerHTML)) {
                okAs.push({
                    title: as[i].getAttribute('title'),
                    link: as[i].getAttribute('href'),
                });
            }
        }
        return okAs;
    });
}

var links = [];
var allPage = [1,2,3,4];
var fetching = false;
var id = setInterval(function () {
    if (!fetching) {
        if (!allPage.length) {
            clearInterval(id);
            console.log('over');
        } else {
            fetching = true;
            let p = allPage.shift();
            fetchPage(p)
                .then(link => {
                    links.push(link);
                    setTimeout(() => {
                        fetching = false;
                    },500);
                });
        }
    }
},500);


//////////////////// 爬取图片 ///////////////////////
var all = [];
var fetching = false;
var id = setInterval(function () {
    if (!fetching) {
        if (!urls.length) {
            clearInterval(id);
            console.log('over');
            return;
        }
        fetching = true;
        let url = urls.pop();
        fetch(url.link).then(_ => _.text()).then(r => {
            let div = document.createElement('div');
            div.innerHTML = r;
            let img = div.getElementsByClassName('nfw-cms-img');
            if (img && img.length) {
                let link = img[0].src;
                all.push(`wget ${link} -O ${url.title}.jpg`);
            }
            fetching = false;
        });
    }
},500);
