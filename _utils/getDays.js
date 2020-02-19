require('./formatNumber');

const formatDate = function(date,format) {
    const dear = {
        'yyyyMMdd'(date) {
            return (date.getYear() + 1900) +
                (date.getMonth() + 1).toLength(2) +
                (date.getDate()).toLength(2);
        },
        'yMd'(date) {
            return (date.getYear() + 1900) + '' +
                (date.getMonth() + 1) + '' +
                (date.getDate());
        },
        'yyyy-MM-dd'(date) {
            return (date.getYear() + 1900) + '-' +
                (date.getMonth() + 1).toLength(2) + '-' +
                (date.getDate()).toLength(2);
        },
        'y-M-d'(date) {
            return (date.getYear() + 1900) + '-' +
                (date.getMonth() + 1) + '-' +
                (date.getDate());
        }
    };
    if (format in dear) {
        return dear[format](date);
    } else {
        return dear.yyyyMMdd(date);
    }
};
/**
 * format = "yyyyMMdd"  20200101    default
 * format = "yMd"       202011
 * format = "yyyy-MM-dd"2020-01-01
 * format = "y-M-d"     2020-1-1
 *
 * endInToday 是否循环到当日就结束输出
 * */
const getFromDay = function(year,month,day,format,endInToday,endYear,endMonth,endDate) {
    const d = new Date();
    const today = new Date();
    const oneDayMill = 1000 * 3600 * 24;
    endYear = parseInt(endYear);
    endMonth = parseInt(endMonth);
    endDate = parseInt(endDate);
    if (!Number.isNaN(endYear) && !Number.isNaN(endMonth) && !Number.isNaN(endDate)) {
        today.setYear(endYear);
        today.setMonth(endMonth - 1);
        today.setDate(endDate);
    }
    let ts = parseInt(formatDate(today,'yyyyMMdd'));
    format = format || "yyyyMMdd";
    d.setYear(year);
    d.setMonth(month - 1);
    d.setDate(day);
    return function () {
        let next = true;
        let ds = parseInt(formatDate(d,'yyyyMMdd'));
        if (ds > ts) {
            next = false;
        }
        if (next) {
            let str = formatDate(d,format);
            d.setTime(d.getTime() + oneDayMill);
            return str;
        } else {
            return false;
        }
    }
};

module.exports = {
    formatDate,
    getFromDay
};