let {
    get,
    getString,
    defaultHeader,
    repFn
} = require('./../_utils/Ajax');
let param = {
    SEC_VERSION: "4.1.6",
    VERSION_NAME: "3.0.0.0",
    MP_CODE: "01",
    GLOBAL_SKEY:"",
    ccbParam: "HfW7ymPV/at0jaNm76QtYbBFIHmVsXbmf69PyekPK0bsP4Y9DskXW6S0q63F/ciUZpc6w4X2DvNe7VSXBb7qsBRbWFS7noJpC2Pj9Zim2gp4qctKLCAueFnXwncCP/ObZ9cRRoD+yJhxkSroTEVmTc+X/HqtmgxhntjZSbGz4UKpTIRZJMfWMBDBc2HsYDxcsuNdgEB3K+gwipLmT/iaZ96IQXTNmjHFx8W7fQ6+ItBdmT1gX113a+o4p1TyEuue29dU69Fw6Hgg+Y8b8mnZayYtbd59FDkFYvRmUits76V3bGja92ebbMCO0iEl/MF/GkMDiY+C8uYU+p1S1dN8r6LKnG6vrwRZML015+LQHgxzPVg1F5cT4a6hy4yRR2/mDD9emECCYyf6V/e5MCOV9FlFLqFsMbFouBWDGhq9h8YNUHiutH2hhV8dlYWO8xWP0Yfyc8Mtdoa7nZ5zafc6nHm0Gy27V5HsE/YA2RxF+1+dT6ThZWaKskDHJH19Fs0Afl8/Or7JOycdKCQtOMiB4K3Csr0E3kmgr6Mq1+j9jKbHykNcTcSoahqwK/SaXFH6cYNamicGpkVkU84zfQPukvXZ9wbjDzfttR9F6o/rGlH3Pr1iyoikjZvoYMZDagzIiVve117vYgq8BJYl+h28vKWFd+MidXSW9M5lkkrFVfHbbKOgn5z4KRsIWoMShF2Z3Lx5bz6HGW/ORuP6IyjYcrvUYCM2XKByARF0xvcATTZwDaE1JZUehbBI7+sm3oydS8duE5sIq3gNV6NvAx2fpxR0V/Rkkw0hcN7TITwWZGs=",
    SYS_CODE: "0760",
    APP_NAME: "com.chinamworld.main",
    SKEY:"",
};
let fs = require('fs');

let url = "https://ibsbjstar.ccb.com.cn/CCBIS/B2CMainPlat_07_MB?";
let savePath = require('./config').savePath;
setInterval(function () {
    get(url + getString(param,str => {
        return repFn["=2%3d"](repFn["+2%2b"](repFn["/2%2f"](str)));
    }),{
        headers: defaultHeader
    })
        .then(_ => {
            let obj = JSON.parse(_);
            if (obj.SUCCESS.toString().toLowerCase() === 'true') {
                let name = obj.PMAccGld_Bss_Prc_List[0].Tms.replace(/:/g,'');
                fs.writeFileSync(savePath + name + '.json',JSON.stringify(obj),'utf-8');
            }
        });
},3000);