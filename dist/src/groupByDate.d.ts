import { DateGroupingOptions } from './commonTypes';
export default function groupByDate<T extends object>(rawData: T[], options: DateGroupingOptions<T>): Array<Record<string, any>>;
