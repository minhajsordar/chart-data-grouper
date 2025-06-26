### Usage Example

```
const { groupByValues, toChartJsFormat } = require('data-grouper-chartjs');

const data = [
  { month: 'January', desktop: 100, mobile: 50 },
  { month: 'January', desktop: 86, mobile: 30 },
  { month: 'February', desktop: 305, mobile: 200 },
];

const grouped = groupByValues(data, 'month', ['desktop', 'mobile'], { type: 'sum' });

const chartData = toChartJsFormat(grouped, ['desktop', 'mobile'], {
  labelKey: 'month',
  includeTotal: true
});

console.log(chartData);
```

```
const data = [
  {
    name: "User A",
    items: [
      { createdAt: "2025-06-25T12:00:00Z", views: 100 },
      { createdAt: "2025-06-25T15:00:00Z", views: 200 },
    ]
  },
  {
    name: "User B",
    items: [
      { createdAt: "2025-06-25T10:00:00Z", views: 300 },
      { createdAt: "2025-06-26T10:00:00Z", views: 50 },
    ]
  }
];

const grouped = groupByValues(data, "createdAt", ["views"], {
  type: "average",
  groupBy: "daily",
  isDate: true,
  arrayPath: "items"
});

const chart = toChartJsFormat(grouped, ["views"]);

console.log(chart);
```

# 📘 Available Input Options for data-grouper-chartjs

This document outlines the available configuration options for the `groupByValues` and `toChartJsFormat` functions.

---

## 🔧 `groupByValues()` Options

### **Parameters**

```ts
function groupByValues(
  data: any[],
  keyPath: string,
  valuePaths: string[],
  options?: GroupOptions
): any[]
```

### **GroupOptions**

| Option        | Type                                                     | Default     | Description                                                        |
| ------------- | -------------------------------------------------------- | ----------- | ------------------------------------------------------------------ |
| `type`        | `'sum' \| 'count' \| 'average'`                          | `'count'`   | Defines how values are aggregated.                                 |
| `groupBy`     | `'none' \| 'daily' \| 'weekly' \| 'monthly' \| 'yearly'` | `'none'`    | Defines how to group by date granularity. Requires `isDate: true`. |
| `isDate`      | `boolean`                                                | `false`     | Treats `keyPath` as a date and formats it.                         |
| `arrayPath`   | `string \| null`                                         | `null`      | If your values are nested in an array, provide the path here.      |
| `customSumFn` | `(item: any, path: string) => number`                    | `undefined` | A custom function to calculate value instead of direct access.     |

---

## 📊 `toChartJsFormat()` Options

### **Parameters**

```ts
function toChartJsFormat(
  groupedData: any[],
  valuePaths: string[],
  options?: ChartJsOptions
): { labels: string[], datasets: { label: string, data: number[] }[] }
```

### **ChartJsOptions**

| Option         | Type      | Default   | Description                                                          |
| -------------- | --------- | --------- | -------------------------------------------------------------------- |
| `labelKey`     | `string`  | `'group'` | Key name used for x-axis labels. Must match a key in grouped object. |
| `includeTotal` | `boolean` | `false`   | If true, appends a final row with the total sum of each valuePath.   |
| `totalLabel`   | `string`  | `'Total'` | Label to use for the total row.                                      |

---

## 🧠 Notes

- For `type: 'average'`, total is still the **sum** unless postprocessed.
- You must use `labelKey` that matches the grouping key (e.g. `createdAt`, `month`, etc).
- `customSumFn` gives full flexibility to compute values based on item logic.

---

## ✅ Example Usage

```ts
const grouped = groupByValues(data, 'createdAt', ['views'], {
  type: 'sum',
  groupBy: 'daily',
  isDate: true,
  arrayPath: 'items'
});

const chartData = toChartJsFormat(grouped, ['views'], {
  labelKey: 'createdAt',
  includeTotal: true
});
```

