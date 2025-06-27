"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALID_TOKENS = void 0;
exports.isValidFormat = isValidFormat;
exports.default = formatDate;
exports.VALID_TOKENS = ['YYYY', 'MMMM', 'MMM', 'MM', 'DD', 'HH', 'mm', 'ss', 'SSS', 'W', 'WW'];
function isValidFormat(format) {
    return format.split(/[^A-Za-z]+/).every(token => token === '' || exports.VALID_TOKENS.includes(token));
}
function formatDate(date, format) {
    const d = new Date(date);
    const pad = (n, size = 2) => n.toString().padStart(size, '0');
    const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthNamesLong = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    // Helper: Get ISO week number (1–53)
    function getWeekNumber(d) {
        const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        const dayNum = date.getUTCDay() || 7;
        date.setUTCDate(date.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
        return weekNo;
    }
    const map = {
        YYYY: d.getFullYear().toString(),
        MM: pad(d.getMonth() + 1),
        MMM: monthNamesShort[d.getMonth()],
        MMMM: monthNamesLong[d.getMonth()],
        DD: pad(d.getDate()),
        HH: pad(d.getHours()),
        mm: pad(d.getMinutes()),
        ss: pad(d.getSeconds()),
        SSS: pad(d.getMilliseconds(), 3),
        W: getWeekNumber(d).toString(),
        WW: pad(getWeekNumber(d)),
    };
    // Sort longest tokens first to avoid partial replacements
    return format.replace(/YYYY|MMMM|MMM|MM|DD|HH|mm|ss|SSS|WW|W/g, token => map[token]);
}
