"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = groupByProperty;
const getValueByPath_1 = require("./getValueByPath");
function groupByProperty(data, options) {
    const { groupBy, valueFields, operation = 'sum', sortBy = 'key', sortDirection = 'asc' } = options;
    const grouped = {};
    data.forEach(item => {
        const groupValue = String((0, getValueByPath_1.default)(item, groupBy));
        if (!groupValue)
            return;
        if (!grouped[groupValue]) {
            grouped[groupValue] = { [groupBy]: groupValue };
            valueFields.forEach(field => {
                grouped[groupValue][field] = [];
            });
        }
        valueFields.forEach(field => {
            const value = (0, getValueByPath_1.default)(item, field);
            if (value !== undefined && value !== null) {
                grouped[groupValue][field].push(Number(value));
            }
        });
    });
    const result = Object.values(grouped).map(group => {
        const output = { [groupBy]: group[groupBy] };
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
    // Sorting
    if (sortBy === 'key') {
        result.sort((a, b) => {
            const compare = String(a[groupBy]).localeCompare(String(b[groupBy]));
            return sortDirection === 'asc' ? compare : -compare;
        });
    }
    else if (valueFields.includes(sortBy)) {
        result.sort((a, b) => {
            const valA = a[sortBy] || 0;
            const valB = b[sortBy] || 0;
            return sortDirection === 'asc' ? valA - valB : valB - valA;
        });
    }
    return result;
}
