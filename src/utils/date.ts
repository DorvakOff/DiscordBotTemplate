const formatDate = (format: string, date: Date = new Date()) => {
    let year = date.getFullYear();
    let month: string | number = date.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }
    let day: number | string = date.getDate();
    if (day < 10) {
        day = '0' + day;
    }

    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    return format
        .replace('YYYY', year.toString())
        .replace('MM', month.toString())
        .replace('DD', day.toString())
        .replace('HH', hour.toString())
        .replace('mm', minute.toString())
        .replace('ss', second.toString());
}

const dateUtils = {
    formatDate
}

export default dateUtils;
