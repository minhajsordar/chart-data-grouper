import { PropertyGroupingOptions } from './commonTypes';
export default function groupByProperty<T extends object>(data: T[], options: PropertyGroupingOptions<T>): Array<Record<string, any>>;
