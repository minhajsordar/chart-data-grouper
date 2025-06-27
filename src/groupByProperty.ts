import { PropertyGroupingOptions } from './commonTypes';
import getValueByPath from './getValueByPath';

export default function groupByProperty<T extends object>(data: T[], options: PropertyGroupingOptions<T>): Array<Record<string, any>> {
  const {
    groupBy,
    valueFields,
    operation = 'sum',
    sortBy = 'key',
    sortDirection = 'asc'
  } = options;

  const grouped: Record<string, any> = {};

  data.forEach(item => {
    const groupValue = String(getValueByPath(item, groupBy as string));
    if (!groupValue) return;

    if (!grouped[groupValue]) {
      grouped[groupValue] = { [groupBy as string]: groupValue };
      valueFields.forEach(field => {
        grouped[groupValue][field as string] = [];
      });
    }

    valueFields.forEach(field => {
      const value = getValueByPath(item, field as string);
      if (value !== undefined && value !== null) {
        grouped[groupValue][field as string].push(Number(value));
      }
    });
  });

  const result = Object.values(grouped).map(group => {
    const output: Record<string, any> = { [groupBy as string]: group[groupBy as string] };
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

  // Sorting
  if (sortBy === 'key') {
    result.sort((a, b) => {
      const compare = String(a[groupBy as string]).localeCompare(String(b[groupBy as string]));
      return sortDirection === 'asc' ? compare : -compare;
    });
  } else if (valueFields.includes(sortBy as keyof T)) {
    result.sort((a, b) => {
      const valA = a[sortBy as string] || 0;
      const valB = b[sortBy as string] || 0;
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    });
  }

  return result;
}