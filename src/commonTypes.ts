export type TimeGrouping = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'minute' | 'hour' | 'second' | string;
export type AggregationOperation = 'sum' | 'average' | 'max' | 'min' | 'count';
export type SortDirection = 'asc' | 'desc';

export interface HistogramOptions<T extends object> {
    valueField: keyof T;
    groupBy?: keyof T;
    bins?: number;
    binType?: 'equal' | 'quantile';
    formatLabel?: (min: number, max: number) => string;
}

export interface HistogramBin {
    range: string;
    count: number;
}

export interface HistogramResult {
    group?: string;
    bins: HistogramBin[];
    total: number;
}


export type EmptyIntervalFill = 0 | 'previous' | undefined;

export interface DateGroupingOptions<T extends object> {
  dateField: keyof T;
  valueFields: Array<keyof T>;
  operation?: AggregationOperation;
  timeGrouping?: TimeGrouping;
  fillEmptyIntervals?: boolean;
  emptyIntervalFill?: EmptyIntervalFill;
  startDate?: Date | string;
  endDate?: Date | string;
}


export interface PropertyGroupingOptions<T extends object> {
  groupBy: keyof T;
  valueFields: Array<keyof T>;
  operation?: AggregationOperation;
  sortBy?: 'key' | keyof T;
  sortDirection?: SortDirection;
}

