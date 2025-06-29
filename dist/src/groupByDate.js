"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = groupByDate;
const getValueByPath_1 = require("./getValueByPath");
const formatDate_1 = require("./formatDate");
function getWeekStartDate(date) {
    // Clone the date to avoid modifying original
    const d = new Date(date);
    // Get day of week (0 = Sunday, 6 = Saturday)
    const day = d.getDay();
    // Calculate difference to previous Sunday
    const diff = d.getDate() - day;
    // Set to start of week (Sunday)
    d.setDate(diff);
    // Set to start of day
    d.setHours(0, 0, 0, 0);
    return d;
}
function generateDateIntervals(start, end, timeGrouping) {
    const intervals = [];
    const current = new Date(start);
    while (current <= end) {
        const date = new Date(current);
        let groupKey;
        if (timeGrouping && (0, formatDate_1.isValidFormat)(timeGrouping)) {
            groupKey = (0, formatDate_1.default)(date, timeGrouping);
        }
        else {
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();
            switch (timeGrouping) {
                case 'milliseconds':
                    groupKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}:${String(date.getMilliseconds()).padStart(3, '0')}`;
                    break;
                case 'seconds':
                    groupKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
                    break;
                case 'minutes':
                    groupKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
                    break;
                case 'hours':
                    groupKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}`;
                    break;
                case 'days':
                    groupKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    break;
                case 'weeks':
                    const weekStart = getWeekStartDate(date);
                    if (timeGrouping && (0, formatDate_1.isValidFormat)(timeGrouping)) {
                        groupKey = (0, formatDate_1.default)(weekStart, timeGrouping);
                    }
                    else {
                        groupKey = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, '0')}-${String(weekStart.getDate()).padStart(2, '0')}`;
                    }
                    break;
                case 'months':
                    groupKey = `${year}-${String(month + 1).padStart(2, '0')}`;
                    break;
                case 'years':
                    groupKey = `${year}`;
                    break;
                default:
                    groupKey = date.toISOString().split('T')[0];
            }
        }
        intervals.push({ key: groupKey, date });
        if (timeGrouping.includes('SSS') || timeGrouping === 'milliseconds') {
            current.setMilliseconds(current.getMilliseconds() + 1);
        }
        else if (timeGrouping.includes('ss') || timeGrouping === 'seconds') {
            current.setSeconds(current.getSeconds() + 1);
        }
        else if (timeGrouping.includes('mm') || timeGrouping === 'minutes') {
            current.setMinutes(current.getMinutes() + 1);
        }
        else if (timeGrouping.includes('HH') || timeGrouping === 'hours') {
            current.setHours(current.getHours() + 1);
        }
        else if (timeGrouping.includes('DD') || timeGrouping === 'days') {
            current.setDate(current.getDate() + 1);
        }
        else if (timeGrouping.includes('W') || timeGrouping === 'weeks') {
            current.setDate(current.getDate() + 7);
        }
        else if (timeGrouping.includes('MM') || timeGrouping === 'months') {
            current.setMonth(current.getMonth() + 1);
        }
        else if (timeGrouping.includes('YYYY') || timeGrouping === 'years') {
            current.setFullYear(current.getFullYear() + 1);
        }
        else {
            current.setDate(current.getDate() + 1); // Default to daily increment for custom formats
        }
    }
    return intervals;
}
function groupByDate(rawData, options) {
    const { dateField, valueFields, operation = 'sum', timeGrouping = 'months', emptyIntervalFill, startDate: startDateOption, endDate: endDateOption, } = options;
    const grouped = {};
    // grouped['count'] = [0];
    // Determine date range
    let minDate = null;
    let maxDate = null;
    let data = rawData;
    const startDateProvided = startDateOption !== undefined;
    const endDateProvided = endDateOption !== undefined;
    if (startDateProvided || endDateProvided) {
        data = rawData.filter(item => {
            const dateValue = (0, getValueByPath_1.default)(item, dateField);
            const date = typeof dateValue === 'string' || dateValue instanceof Date ? new Date(dateValue) : null;
            return date && (!startDateProvided || date >= new Date(startDateOption)) && (!endDateProvided || date <= new Date(endDateOption));
        });
    }
    // Find min and max dates from data if not provided
    data.forEach(item => {
        const dateValue = (0, getValueByPath_1.default)(item, dateField);
        const date = typeof dateValue === 'string' || dateValue instanceof Date ? new Date(dateValue) : null;
        if (!date || isNaN(date.getTime()))
            return;
        if (!minDate || date < minDate)
            minDate = new Date(date);
        if (!maxDate || date > maxDate)
            maxDate = new Date(date);
    });
    // Use provided dates if available
    const startDate = startDateOption ? new Date(startDateOption) : minDate;
    const endDate = endDateOption ? new Date(endDateOption) : maxDate;
    if (!startDate || !endDate) {
        return [];
    }
    // Generate all intervals if emptyIntervalFill is specified
    const allIntervals = emptyIntervalFill !== undefined
        ? generateDateIntervals(startDate, endDate, timeGrouping)
        : [];
    // Initialize empty intervals if needed
    if (emptyIntervalFill !== undefined) {
        allIntervals.forEach(({ key }) => {
            if (!grouped[key]) {
                grouped[key] = { date: key };
                if (operation === 'count') {
                    grouped[key]['count'] = 0;
                }
                else {
                    valueFields.forEach(field => {
                        grouped[key][field] = [];
                    });
                }
            }
        });
    }
    // Process data
    data.forEach(item => {
        const dateValue = (0, getValueByPath_1.default)(item, dateField);
        const date = typeof dateValue === 'string' || dateValue instanceof Date ? new Date(dateValue) : null;
        if (!date || isNaN(date.getTime()))
            return;
        let groupKey;
        if (timeGrouping && (0, formatDate_1.isValidFormat)(timeGrouping)) {
            groupKey = (0, formatDate_1.default)(date, timeGrouping);
        }
        else {
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();
            switch (timeGrouping) {
                case 'milliseconds':
                    groupKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}:${String(date.getMilliseconds()).padStart(3, '0')}`;
                    break;
                case 'seconds':
                    groupKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
                    break;
                case 'minutes':
                    groupKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
                    break;
                case 'hours':
                    groupKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}`;
                    break;
                case 'days':
                    groupKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    break;
                case 'weeks':
                    const weekStart = getWeekStartDate(date);
                    if (timeGrouping && (0, formatDate_1.isValidFormat)(timeGrouping)) {
                        groupKey = (0, formatDate_1.default)(weekStart, timeGrouping);
                    }
                    else {
                        groupKey = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, '0')}-${String(weekStart.getDate()).padStart(2, '0')}`;
                    }
                    break;
                case 'months':
                    groupKey = `${year}-${String(month + 1).padStart(2, '0')}`;
                    break;
                case 'years':
                    groupKey = `${year}`;
                    break;
                default:
                    groupKey = date.toISOString().split('T')[0];
            }
        }
        if (!grouped[groupKey]) {
            grouped[groupKey] = { date: groupKey };
            if (operation === 'count') {
                grouped[groupKey]['count'] = 0;
            }
            else {
                valueFields.forEach(field => {
                    grouped[groupKey][field] = [];
                });
            }
        }
        if (operation === 'count') {
            grouped[groupKey]['count'] += 1;
        }
        else {
            valueFields.forEach(field => {
                const value = (0, getValueByPath_1.default)(item, field);
                if (value !== undefined && value !== null) {
                    grouped[groupKey][field].push(Number(value));
                }
            });
        }
    });
    // Calculate aggregated values
    let result = Object.values(grouped).map(group => {
        const output = { date: group.date };
        if (operation === 'count') {
            output['count'] = group['count'];
            return output;
        }
        valueFields.forEach(field => {
            const values = group[field].filter((v) => !isNaN(v));
            if (values.length === 0) {
                output[field] = null;
                return;
            }
            switch (operation) {
                case 'sum':
                    output[field] = values.reduce((a, b) => a + b, 0);
                    break;
                case 'average':
                    output[field] = +(values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
                    break;
                case 'max':
                    output[field] = Math.max(...values);
                    break;
                case 'min':
                    output[field] = Math.min(...values);
                    break;
                default:
                    output[field] = values.reduce((a, b) => a + b, 0);
            }
        });
        return output;
    });
    // Sort by date
    const intervalsWithDates = emptyIntervalFill !== undefined
        ? allIntervals
        : Object.keys(grouped).map(key => ({
            key,
            date: new Date(key.includes('T') ? key : key.includes('-')
                ? key.length === 4
                    ? `${key}-01-01` // Year only
                    : key.length === 7
                        ? `${key}-01` // Year-month
                        : key // Year-month-day
                : key)
        }));
    function parseFormattedDate(dateStr, format) {
        let year = 0, month = 0, day = 1, hours = 0, minutes = 0, seconds = 0, ms = 0;
        // Helper to extract value by token
        const extract = (token) => {
            const pos = format.indexOf(token);
            return pos >= 0 ? dateStr.slice(pos, pos + token.length) : '';
        };
        // Extract components
        const yyyy = extract('YYYY');
        const mmmm = extract('MMMM');
        const mmm = extract('MMM');
        const mm = extract('MM');
        const dd = extract('DD');
        const hh = extract('HH');
        const mi = extract('mm');
        const ss = extract('ss');
        const sss = extract('SSS');
        // Set year if exists
        if (yyyy)
            year = parseInt(yyyy, 10);
        // Set month (prioritize longer tokens)
        if (mmmm) {
            month = new Date(`${mmmm} 1, 2000`).getMonth();
        }
        else if (mmm) {
            month = new Date(`${mmm} 1, 2000`).getMonth();
        }
        else if (mm) {
            month = parseInt(mm, 10) - 1;
        }
        // Set other components
        if (dd)
            day = parseInt(dd, 10);
        if (hh)
            hours = parseInt(hh, 10);
        if (mi)
            minutes = parseInt(mi, 10);
        if (ss)
            seconds = parseInt(ss, 10);
        if (sss)
            ms = parseInt(sss, 10);
        return new Date(year, month, day, hours, minutes, seconds, ms);
    }
    result = result.sort((a, b) => {
        if ((0, formatDate_1.isValidFormat)(timeGrouping)) {
            const dateA = parseFormattedDate(a.date, timeGrouping);
            const dateB = parseFormattedDate(b.date, timeGrouping);
            return dateA.getTime() - dateB.getTime();
        }
        const dateA = intervalsWithDates.find(i => i.key === a.date)?.date;
        const dateB = intervalsWithDates.find(i => i.key === b.date)?.date;
        return (dateA?.getTime() || 0) - (dateB?.getTime() || 0);
    });
    // Handle empty interval filling
    if (emptyIntervalFill !== undefined) {
        let previousValues = {};
        if (operation === 'count') {
            previousValues['count'] = 0;
        }
        else {
            valueFields.forEach(field => {
                previousValues[field] = 0;
            });
        }
        result = result.map(item => {
            const output = { date: item.date };
            if (operation === 'count') {
                output['count'] = item['count'];
                previousValues['count'] = item['count'];
            }
            else {
                valueFields.forEach(field => {
                    if (item[field] !== null) {
                        output[field] = item[field];
                        previousValues[field] = item[field];
                    }
                    else {
                        output[field] = emptyIntervalFill === 0
                            ? 0
                            : previousValues[field] !== undefined
                                ? previousValues[field]
                                : 0;
                    }
                });
            }
            return output;
        });
    }
    return result;
}
