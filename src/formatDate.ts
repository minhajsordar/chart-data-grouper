export const VALID_TOKENS = ['YYYY', 'MMMM', 'MMM', 'MM', 'DD', 'HH', 'mm', 'ss', 'SSS', 'W', 'WW', 'A', 'a'];

export function isValidFormat(format: string): boolean {
  return format.split(/[^A-Za-z]+/).every(token =>
    token === '' || VALID_TOKENS.includes(token)
  );
}

export default function formatDate(date: Date | string | number, format: string): string {
  const d = new Date(date);

  const pad = (n: number, size = 2) => n.toString().padStart(size, '0');
 
  const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthNamesLong = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];

  // Helper: Get ISO week number (1–53)
  function getWeekNumber(d: Date): number {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return weekNo;
  }

  const hours = d.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;

  const map: Record<string, string> = {
    YYYY: d.getFullYear().toString(),
    MM: pad(d.getMonth() + 1),
    MMM: monthNamesShort[d.getMonth()],
    MMMM: monthNamesLong[d.getMonth()],
    DD: pad(d.getDate()),
    HH: pad(hours12), // Note: Changed to 12-hour format to match AM/PM
    mm: pad(d.getMinutes()),
    ss: pad(d.getSeconds()),
    SSS: pad(d.getMilliseconds(), 3),
    W: getWeekNumber(d).toString(),
    WW: pad(getWeekNumber(d)),
    A: ampm,
    a: ampm.toLowerCase(),
  };

  // Sort longest tokens first to avoid partial replacements
  return format.replace(/YYYY|MMMM|MMM|MM|DD|HH|mm|ss|SSS|WW|W|A|a/g, token => map[token]);
}