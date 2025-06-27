import { groupByDate ,groupByProperty,generateHistogram} from './dist/index.js';

const testCaseForSumAndAverage = [
    { month: 'January', desktop: 100, mobile: 50 },
    { month: 'January', desktop: 86, mobile: 30 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 305, mobile: 200 },
    { month: 'April', desktop: 305, mobile: 200 },
    { month: 'May', desktop: 305, mobile: 200 },
    { month: 'June', desktop: 305, mobile: 200 },
];
const testCaseForCountSumAndAverageByMinutesHourlyDailyMonthlyYearlyAndNone = [
    { createdAt: '2025-06-25T12:00:00Z', desktop: 100, mobile: 50 },
    { createdAt: '2025-06-25T12:02:01Z', desktop: 86, mobile: 30 },
    { createdAt: '2025-06-26T12:02:04Z', desktop: 305, mobile: 200 },
    { createdAt: '2025-06-25T12:00:02Z', desktop: 305, mobile: 200 },
];
const histogramTestCase = [
    {dataOption:{ gender: 'iphone', age: 100 }},
    {dataOption:{ gender: 'android', age: 86 }},
    {dataOption:{ gender: 'iphone', age: 5 }},
    {dataOption:{ gender: 'android', age: 35 }},
    {dataOption:{ gender: 'motorola', age: 5 }},
    {dataOption:{ gender: 'android', age: 1 }},
    {dataOption:{ gender: 'motorola', age: 5 }},
    {dataOption:{ gender: 'nokia', age: 35 }},
    {dataOption:{ gender: 'nokia', age: 35 }},
    {dataOption:{ gender: 'iphone', age: 5 }},
];
// 1. Date grouping example
const dateGrouped = groupByDate(testCaseForCountSumAndAverageByMinutesHourlyDailyMonthlyYearlyAndNone, {
    dateField: 'createdAt',
    valueFields: ['desktop', 'mobile'],
    operation: 'sum',
    timeGrouping: 'minute',
    monthFormat: 'long'
});

// 2. Histogram example
const histogramData = generateHistogram(histogramTestCase, {
    valueField: 'dataOption.age',
    groupBy: 'dataOption.gender',
    bins: 5
});

// 3. Property grouping example
const propertyGrouped = groupByProperty(testCaseForSumAndAverage, {
    groupBy: 'month',
    valueFields: ['desktop', 'mobile'],
    sortBy: 'month',
});
// Returns histogram data grouped by gender
console.log("dateGrouped", dateGrouped);
console.log("histogramData", JSON.stringify(histogramData, null, 2));
console.log("propertyGrouped", propertyGrouped);
