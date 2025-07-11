"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = generateHistogram;
const getValueByPath_1 = __importDefault(require("./getValueByPath"));
function generateHistogram(data, options) {
    const { valueField, groupBy, bins = 5, binType = 'equal', formatLabel = (min, max) => `${min}-${max}` } = options;
    const results = [];
    const maxValue = Math.max(...data.map(item => Number((0, getValueByPath_1.default)(item, valueField))));
    const minValue = Math.min(...data.map(item => Number((0, getValueByPath_1.default)(item, valueField))));
    if (groupBy) {
        // Grouped histogram
        const groups = {};
        data.forEach(item => {
            const groupValue = String((0, getValueByPath_1.default)(item, groupBy));
            if (!groups[groupValue]) {
                groups[groupValue] = [];
            }
            const value = Number((0, getValueByPath_1.default)(item, valueField));
            if (!isNaN(value)) {
                groups[groupValue].push(value);
            }
        });
        for (const [groupName, values] of Object.entries(groups)) {
            if (values.length === 0)
                continue;
            let binRanges;
            if (binType === 'equal') {
                const min = minValue;
                const max = maxValue;
                const binSize = (max - min) / bins;
                binRanges = Array(bins).fill(0).map((_, i) => ({
                    min: min + i * binSize,
                    max: min + (i + 1) * binSize
                }));
            }
            else {
                // Quantile bins
                const sorted = [...values].sort((a, b) => a - b);
                binRanges = Array(bins).fill(0).map((_, i) => ({
                    min: sorted[Math.floor((i / bins) * sorted.length)],
                    max: sorted[Math.floor(((i + 1) / bins) * sorted.length) - 1]
                }));
            }
            const histogram = binRanges.map(range => {
                const count = values.filter(v => v >= range.min && v < range.max).length;
                return {
                    range: formatLabel(range.min, range.max),
                    count
                };
            });
            results.push({
                group: groupName,
                bins: histogram,
                total: values.length,
            });
        }
    }
    else {
        // Simple histogram
        const values = data.map(item => Number((0, getValueByPath_1.default)(item, valueField))).filter(v => !isNaN(v));
        if (values.length === 0)
            return results;
        let binRanges;
        if (binType === 'equal') {
            const min = Math.min(...values);
            const max = Math.max(...values);
            const binSize = (max - min) / bins;
            binRanges = Array(bins).fill(0).map((_, i) => ({
                min: min + i * binSize,
                max: min + (i + 1) * binSize
            }));
        }
        else {
            // Quantile bins
            const sorted = [...values].sort((a, b) => a - b);
            binRanges = Array(bins).fill(0).map((_, i) => ({
                min: sorted[Math.floor((i / bins) * sorted.length)],
                max: sorted[Math.floor(((i + 1) / bins) * sorted.length) - 1]
            }));
        }
        const histogram = binRanges.map(range => {
            const count = values.filter(v => v >= range.min && v < range.max).length;
            return {
                range: formatLabel(range.min, range.max),
                count
            };
        });
        results.push({
            bins: histogram,
            total: values.length,
        });
    }
    return results;
}
