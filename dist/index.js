"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupByValues = groupByValues;
exports.toChartJsFormat = toChartJsFormat;
function getValueByPath(obj, path) {
    return path.split(".").reduce((o, p) => o?.[p], obj);
}
function formatDate(date, mode) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    switch (mode) {
        case "year":
        case "yearly": return `${y}`;
        case "month":
        case "monthly": return `${y}-${m}`;
        case "week":
        case "weekly": {
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - weekStart.getDay());
            return `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, "0")}-${String(weekStart.getDate()).padStart(2, "0")}`;
        }
        case "day":
        case "daily": return `${y}-${m}-${d}`;
        default: return date.toISOString();
    }
}
function groupByValues(data, keyPath, valuePaths = [], options = {}) {
    const { type = 'count', customSumFn = null, groupBy = 'none', isDate = false, arrayPath = null } = options;
    const flatItems = [];
    for (const item of data) {
        if (arrayPath) {
            const nested = getValueByPath(item, arrayPath);
            if (Array.isArray(nested)) {
                nested.forEach(subItem => flatItems.push({ ...subItem, __parent__: item }));
            }
        }
        else {
            flatItems.push(item);
        }
    }
    const grouped = {};
    const counts = {};
    for (const item of flatItems) {
        const keySource = isDate ? new Date(getValueByPath(item, keyPath)) : getValueByPath(item, keyPath);
        if (!keySource || (isDate && isNaN(keySource)))
            continue;
        const groupKey = isDate ? formatDate(new Date(keySource), groupBy) : keySource;
        if (!grouped[groupKey]) {
            grouped[groupKey] = { [keyPath]: groupKey };
            counts[groupKey] = 0;
            valuePaths.forEach(path => grouped[groupKey][path] = 0);
        }
        valuePaths.forEach(path => {
            let value = 0;
            if (typeof customSumFn === 'function') {
                value = customSumFn(item, path) || 0;
            }
            else {
                value = parseFloat(getValueByPath(item, path)) || 0;
            }
            grouped[groupKey][path] += value;
        });
        counts[groupKey] += 1;
    }
    if (type === 'average') {
        for (const group in grouped) {
            valuePaths.forEach(path => {
                grouped[group][path] = +(grouped[group][path] / counts[group]).toFixed(2);
            });
        }
    }
    return Object.values(grouped).sort((a, b) => String(a[keyPath]).localeCompare(String(b[keyPath])));
}
function toChartJsFormat(groupedData, valuePaths = [], options = {}) {
    const { labelKey = 'group', includeTotal = false, totalLabel = 'Total' } = options;
    const labels = groupedData.map(item => item[labelKey]);
    const datasets = valuePaths.map(path => {
        const data = groupedData.map(item => item[path] ?? 0);
        return {
            label: path,
            data
        };
    });
    if (includeTotal) {
        const totalRow = { [labelKey]: totalLabel };
        valuePaths.forEach(path => {
            totalRow[path] = groupedData.reduce((sum, item) => sum + (item[path] ?? 0), 0);
        });
        labels.push(totalLabel);
        valuePaths.forEach((path, i) => {
            datasets[i].data.push(totalRow[path]);
        });
    }
    return { labels, datasets };
}
