import { groupByDate, groupByProperty, generateHistogram, formatDate } from './dist/index.js';
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
    { createdAt: '2025-06-25T12:01:00Z', desktop: 86, mobile: 30 },
    { createdAt: '2025-06-27T12:02:02Z', desktop: 305, mobile: 200 },
    { createdAt: '2025-06-27T12:03:03Z', desktop: 305, mobile: 200 },
];
const histogramTestCase = [
    { dataOption: { gender: 'iphone', age: 100 } },
    { dataOption: { gender: 'android', age: 86 } },
    { dataOption: { gender: 'iphone', age: 5 } },
    { dataOption: { gender: 'android', age: 35 } },
    { dataOption: { gender: 'motorola', age: 5 } },
    { dataOption: { gender: 'android', age: 1 } },
    { dataOption: { gender: 'motorola', age: 5 } },
    { dataOption: { gender: 'nokia', age: 35 } },
    { dataOption: { gender: 'nokia', age: 35 } },
    { dataOption: { gender: 'iphone', age: 5 } },
];
// 1. Date grouping example
const dateGrouped = groupByDate(testCaseForCountSumAndAverageByMinutesHourlyDailyMonthlyYearlyAndNone, {
    dateField: 'createdAt',
    valueFields: ['desktop', 'mobile'],
    operation: 'sum',
    timeGrouping: 'days', // 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years' | 'YYYY-MM-DD-HH:mm:ss:SSS'
    emptyIntervalFill: 0,
    // startDate: '2025-06-22T12:00:00Z',
    endDate: '2025-06-27T23:59:59Z'
});

// // 2. Histogram example
// const histogramData = generateHistogram(histogramTestCase, {
//     valueField: 'dataOption.age',
//     groupBy: 'dataOption.gender',
//     bins: 5
// });

// // 3. Property grouping example
// const propertyGrouped = groupByProperty(testCaseForSumAndAverage, {
//     groupBy: 'month',
//     valueFields: ['desktop', 'mobile'],
//     sortBy: 'month',
// });
// Returns histogram data grouped by gender
console.log("dateGrouped", dateGrouped);
console.log("dateGrouped", dateGrouped.length);
console.log("formatDate", formatDate(new Date(), 'YYYY-MMMM-DD-HH-mm-ss'));
// console.log("histogramData", JSON.stringify(histogramData, null, 2));
// console.log("propertyGrouped", propertyGrouped);

const sampleData = [
    { id: 1, date: '2023-01-15T10:30:00', value: 10, visits: 5 },
    { id: 2, date: '2023-01-15T11:45:00', value: 20, visits: 3 },
    { id: 3, date: '2023-01-16T09:15:00', value: 15, visits: 7 },
    { id: 4, date: '2023-02-01T14:00:00', value: 30, visits: 2 },
    { id: 5, date: '2023-02-15T16:30:00', value: 25, visits: 4 },
];

const baseOptions = {
    dateField: 'date',
    valueFields: ['value', 'visits'],
};
const options = {
    ...baseOptions,
    timeGrouping: 'YYYY-MM-WW',
    emptyIntervalFill: 0,
    operation: 'sum',
};

const result = groupByDate(sampleData, options);

// Week starts on Sunday (2023-01-15 is Sunday)
console.log("result", result);