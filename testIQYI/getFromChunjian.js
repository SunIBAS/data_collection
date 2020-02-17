const http = require('http');

http.get('http://chujian.xiaoyule-app.cn/api.php?url=http://www.iqiyi.com/v_19rsereed0.html&cb=jQuery182034903109311539526_1581835579632&_=' + (new Date).getTime(),
    (resp) => {
    let data = '';
    resp.on('data',(chunk) => data += chunk);
    resp.on('end',() => {
        console.log(data)
    });
    resp.on("error",err => {
        console.log(err)
    });
});