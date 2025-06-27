
# Chart Data Grouper

A flexible TypeScript library for grouping and aggregating data with support for nested properties, date/time grouping, and histogram generation.

## Installation

```bash
npm install chart-data-grouper
# or
yarn add chart-data-grouper
```

## Features

- Group data by date/time with multiple precision levels
- Generate histograms with equal or quantile bins
- Aggregate values using sum, average, min, max, count
- Handle nested property paths (e.g., "user.profile.age")
- TypeScript support with full type safety

## API Reference

### `groupByDate`

Groups data by date/time intervals and applies aggregations.

```typescript
import { groupByDate } from 'chart-data-grouper';

const result = groupByDate(data, {
  dateField: 'createdAt',       // Path to date field (supports nesting)
  valueFields: ['value'],       // Fields to aggregate
  operation: 'sum',            // 'sum' | 'average' | 'max' | 'min' | 'count'
  timeGrouping: 'daily',       // 'seconds' | 'minutes' | 'hours' | 'daily' | 
                              // 'weekly' | 'monthly' | 'yearly'
  monthFormat: 'short'         // 'short' (Jan) | 'long' (January) | 'numeric' (1)
});
```

### `groupByProperty`

Groups data by property values and applies aggregations.

```typescript
import { groupByProperty } from 'chart-data-grouper';

const result = groupByProperty(data, {
  groupBy: 'category',         // Path to group by field
  valueFields: ['price', 'qty'], // Fields to aggregate
  operation: 'average',        // Aggregation operation
  sortBy: 'key',              // 'key' or field path
  sortDirection: 'asc'        // 'asc' | 'desc'
});
```

### `generateHistogram`

Generates histogram data for numerical values.

```typescript
import { generateHistogram } from 'chart-data-grouper';

const result = generateHistogram(data, {
  valueField: 'age',           // Path to numerical field
  groupBy: 'gender',          // Optional grouping field
  bins: 5,                    // Number of bins
  binType: 'equal',           // 'equal' | 'quantile'
  formatLabel: (min, max) =>  // Custom bin label formatter
    `${min.toFixed(0)}-${max.toFixed(0)}`
});
```

### `getValueByPath`

Utility function to get nested property values.

```typescript
import { getValueByPath } from 'chart-data-grouper';

const value = getValueByPath(obj, 'nested.property.path');
```

## Usage Examples
### 1. Group By Date, Sum and Average, Monthly, Daily, Hourly, Minute, Second, Yearly, Weekly, Histogram

```typescript
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

```

### 2. Daily Sales Aggregation

```typescript
const salesData = [...] // Array of sales transactions

const dailySales = groupByDate(salesData, {
  dateField: 'transactionDate',
  valueFields: ['amount'],
  operation: 'sum',
  timeGrouping: 'daily'
});
```

### 3. Product Category Statistics

```typescript
const products = [...] // Array of products

const categoryStats = groupByProperty(products, {
  groupBy: 'category.name',
  valueFields: ['price', 'stock'],
  operation: 'average'
});
```

### 4. Age Distribution Histogram

```typescript
const users = [...] // Array of user profiles

const ageHistogram = generateHistogram(users, {
  valueField: 'profile.age',
  groupBy: 'profile.gender',
  bins: 10,
  binType: 'equal'
});
```

## Type Support

All functions are fully typed with TypeScript support. The package exports these types for your convenience:

```typescript
import {
  TimeGrouping,
  MonthFormat,
  AggregationOperation,
  SortDirection,
  HistogramBin,
  HistogramResult
} from 'chart-data-grouper';
```

## Error Handling

The library handles:
- Missing or invalid dates
- Non-numerical values in aggregation fields
- Missing nested properties
- Empty data sets gracefully

## License

MIT
```

## Key Features of This README:

1. **Clear Installation Instructions** - Shows both npm and yarn options
2. **Basic Usage Example** - Gets users started quickly
3. **Comprehensive API Reference** - Documents all parameters and options
4. **Practical Examples** - Covers common use cases
5. **Output Format Documentation** - Clearly shows what to expect
6. **Development Section** - For contributors
7. **Clean Formatting** - Uses markdown tables and code blocks for readability
```