import { DateGroupingOptions, TimeGrouping } from './commonTypes';
import getValueByPath from './getValueByPath';
import formatDate, { isValidFormat } from './formatDate';

function generateDateIntervals(
  start: Date,
  end: Date,
  timeGrouping: TimeGrouping,
): { key: string, date: Date }[] {
  const intervals: { key: string, date: Date }[] = [];
  const current = new Date(start);

  while (current <= end) {
    const date = new Date(current);
    let groupKey: string;

    if (timeGrouping && isValidFormat(timeGrouping)) {
      groupKey = formatDate(date, timeGrouping);
    } else {
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
          const weekStart = new Date(date);
          weekStart.setDate(day - date.getDay());
          groupKey = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, '0')}-${String(weekStart.getDate()).padStart(2, '0')}`;
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
    } else {
      current.setDate(current.getDate() + 1); // Default to daily increment for custom formats
    }
  }

  return intervals;
}

export default function groupByDate<T extends object>(rawData: T[], options: DateGroupingOptions<T>): Array<Record<string, any>> {
  const {
    dateField,
    valueFields,
    operation = 'sum',
    timeGrouping = 'months',
    emptyIntervalFill,
    startDate: startDateOption,
    endDate: endDateOption,
  } = options;

  const grouped: Record<string, any> = {};

  // Determine date range
  let minDate: Date | null = null;
  let maxDate: Date | null = null;
  let data = rawData;
  const startDateProvided = startDateOption !== undefined;
  const endDateProvided = endDateOption !== undefined;

  if (startDateProvided || endDateProvided) {
    data = rawData.filter(item => {
      const dateValue = getValueByPath(item, dateField as string);
      const date = typeof dateValue === 'string' || dateValue instanceof Date ? new Date(dateValue) : null;
      return date && (!startDateProvided || date >= new Date(startDateOption)) && (!endDateProvided || date <= new Date(endDateOption));
    });
  }
  // Find min and max dates from data if not provided
  data.forEach(item => {
    const dateValue = getValueByPath(item, dateField as string);
    const date = typeof dateValue === 'string' || dateValue instanceof Date ? new Date(dateValue) : null;
    if (!date || isNaN(date.getTime())) return;

    if (!minDate || date < minDate) minDate = new Date(date);
    if (!maxDate || date > maxDate) maxDate = new Date(date);
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
        valueFields.forEach(field => {
          grouped[key][field as string] = [];
        });
      }
    });
  }

  // Process data
  data.forEach(item => {
    const dateValue = getValueByPath(item, dateField as string);
    const date = typeof dateValue === 'string' || dateValue instanceof Date ? new Date(dateValue) : null;
    if (!date || isNaN(date.getTime())) return;

    let groupKey: string;
    if (timeGrouping && isValidFormat(timeGrouping)) {
      groupKey = formatDate(date, timeGrouping);
    } else {
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
          const weekStart = new Date(date);
          weekStart.setDate(day - date.getDay());
          groupKey = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, '0')}-${String(weekStart.getDate()).padStart(2, '0')}`;
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
      valueFields.forEach(field => {
        grouped[groupKey][field as string] = [];
      });
    }

    valueFields.forEach(field => {
      const value = getValueByPath(item, field as string);
      if (value !== undefined && value !== null) {
        grouped[groupKey][field as string].push(Number(value));
      }
    });
  });

  // Calculate aggregated values
  let result = Object.values(grouped).map(group => {
    const output: Record<string, any> = { date: group.date };
    valueFields.forEach(field => {
      const values = group[field as string].filter((v: number) => !isNaN(v));
      if (values.length === 0) {
        output[field as string] = null;
        return;
      }

      switch (operation) {
        case 'sum':
          output[field as string] = values.reduce((a: number, b: number) => a + b, 0);
          break;
        case 'average':
          output[field as string] = +(values.reduce((a: number, b: number) => a + b, 0) / values.length).toFixed(2);
          break;
        case 'max':
          output[field as string] = Math.max(...values);
          break;
        case 'min':
          output[field as string] = Math.min(...values);
          break;
        case 'count':
          output[field as string] = values.length;
          break;
        default:
          output[field as string] = values.reduce((a: number, b: number) => a + b, 0);
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

  result = result.sort((a, b) => {
    const dateA = intervalsWithDates.find(i => i.key === a.date)?.date;
    const dateB = intervalsWithDates.find(i => i.key === b.date)?.date;
    return (dateA?.getTime() || 0) - (dateB?.getTime() || 0);
  });

  // Handle empty interval filling
  if (emptyIntervalFill !== undefined) {
    let previousValues: Record<string, any> = {};
    valueFields.forEach(field => {
      previousValues[field as string] = 0;
    });

    result = result.map(item => {
      const output: Record<string, any> = { date: item.date };
      valueFields.forEach(field => {
        if (item[field as string] !== null) {
          output[field as string] = item[field as string];
          previousValues[field as string] = item[field as string];
        } else {
          output[field as string] = emptyIntervalFill === 0
            ? 0
            : previousValues[field as string] !== undefined
              ? previousValues[field as string]
              : 0;
        }
      });
      return output;
    });
  }

  return result;
}