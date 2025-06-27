import { HistogramOptions, HistogramResult } from './commonTypes';
export default function generateHistogram<T extends object>(data: T[], options: HistogramOptions<T>): HistogramResult[];
