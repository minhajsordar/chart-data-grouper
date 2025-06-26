export type GroupByType = 'count' | 'sum' | 'average';
export type GroupMode = 'none' | 'daily' | 'day' | 'weekly' | 'week' | 'monthly' | 'month' | 'yearly' | 'year';
export interface GroupOptions {
    type?: GroupByType;
    customSumFn?: (item: any, path: string) => number;
    groupBy?: GroupMode;
    isDate?: boolean;
    arrayPath?: string | null;
}
export interface ChartJsOptions {
    labelKey?: string;
    includeTotal?: boolean;
    totalLabel?: string;
}
export declare function groupByValues(data: any[], keyPath: string, valuePaths?: string[], options?: GroupOptions): any[];
export declare function toChartJsFormat(groupedData: any[], valuePaths?: string[], options?: ChartJsOptions): {
    labels: any[];
    datasets: {
        label: string;
        data: any[];
    }[];
};
