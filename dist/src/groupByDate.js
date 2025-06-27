"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = groupByDate;
const getValueByPath_1 = require("./getValueByPath");
function groupByDate(data, options) {
    const { dateField, valueFields, operation = 'sum', timeGrouping = 'monthly', monthFormat = 'short' } = options;
    const monthNames = {
        short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        long: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    };
    const grouped = {};
    data.forEach(item => {
        const dateValue = (0, getValueByPath_1.default)(item, dateField);
        const date = typeof dateValue === 'string' || dateValue instanceof Date ? new Date(dateValue) : null;
        if (!date || isNaN(date.getTime()))
            return;
        let groupKey;
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        switch (timeGrouping) {
            case 'second':
                groupKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
                break;
            case 'minute':
                groupKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
                break;
            case 'hour':
                groupKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}`;
                break;
            case 'daily':
                groupKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                break;
            case 'weekly':
                const weekStart = new Date(date);
                weekStart.setDate(day - date.getDay());
                groupKey = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, '0')}-${String(weekStart.getDate()).padStart(2, '0')}`;
                break;
            case 'monthly':
                if (monthFormat === 'numeric') {
                    groupKey = `${year}-${String(month + 1).padStart(2, '0')}`;
                }
                else {
                    groupKey = `${year}-${monthNames[monthFormat][month]}`;
                }
                break;
            case 'yearly':
                groupKey = `${year}`;
                break;
            default:
                groupKey = date.toISOString().split('T')[0];
        }
        if (!grouped[groupKey]) {
            grouped[groupKey] = { date: groupKey };
            valueFields.forEach(field => {
                grouped[groupKey][field] = [];
            });
        }
        valueFields.forEach(field => {
            const value = (0, getValueByPath_1.default)(item, field);
            if (value !== undefined && value !== null) {
                grouped[groupKey][field].push(Number(value));
            }
        });
    });
    const result = Object.values(grouped).map(group => {
        const output = { date: group.date };
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
                case 'count':
                    output[field] = values.length;
                    break;
                default:
                    output[field] = values.reduce((a, b) => a + b, 0);
            }
        });
        return output;
    });
    return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
