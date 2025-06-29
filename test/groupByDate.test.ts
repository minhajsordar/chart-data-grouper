import groupByDate from '../src/groupByDate';
import { DateGroupingOptions } from '../src/commonTypes';

describe('groupByDate', () => {
    const sampleData = [
        { id: 1, createdAt: '2023-01-15T10:30:00', value: 10, visits: 5 },
        { id: 2, createdAt: '2023-01-15T11:45:00', value: 20, visits: 3 },
        { id: 3, createdAt: '2023-01-16T09:15:00', value: 15, visits: 7 },
        { id: 4, createdAt: '2023-02-01T14:00:00', value: 30, visits: 2 },
        { id: 5, createdAt: '2023-02-15T16:30:00', value: 25, visits: 4 },
    ];

    const baseOptions: DateGroupingOptions<typeof sampleData[0]> = {
        dateField: 'createdAt',
        valueFields: ['value', 'visits'],
    };

    test('should group by daily with sum operation', () => {
        const options: DateGroupingOptions<typeof sampleData[0]> = {
            ...baseOptions,
            timeGrouping: 'days',
            operation: 'sum',
        };

        const result = groupByDate(sampleData, options);

        expect(result).toEqual([
            { date: '2023-01-15', value: 30, visits: 8 },
            { date: '2023-01-16', value: 15, visits: 7 },
            { date: '2023-02-01', value: 30, visits: 2 },
            { date: '2023-02-15', value: 25, visits: 4 },
        ]);
    });

    test('should group by monthly with average operation', () => {
        const options: DateGroupingOptions<typeof sampleData[0]> = {
            ...baseOptions,
            timeGrouping: 'months',
            operation: 'average',
        };

        const result = groupByDate(sampleData, options);

        expect(result).toEqual([
            { date: '2023-01', value: 15, visits: 5 },
            { date: '2023-02', value: 27.5, visits: 3 },
        ]);
    });
    test('should group by custom date format', () => {
        const options: DateGroupingOptions<typeof sampleData[0]> = {
            ...baseOptions,
            timeGrouping: 'DD-MM-YYYY',
        };

        const result = groupByDate(sampleData, options);
        expect(result).toEqual([
            { date: '15-01-2023', value: 30, visits: 8 },
            { date: '16-01-2023', value: 15, visits: 7 },
            { date: '01-02-2023', value: 30, visits: 2 },
            { date: '15-02-2023', value: 25, visits: 4 },
        ]);
    });

    test('should fill empty intervals with 0', () => {
        const options: DateGroupingOptions<typeof sampleData[0]> = {
            ...baseOptions,
            timeGrouping: 'days',
            operation: 'sum',
            emptyIntervalFill: 0,
            startDate: '2023-01-15',
            endDate: '2023-01-17',
        };

        const result = groupByDate(sampleData, options);

        expect(result).toEqual([
            { date: '2023-01-15', value: 30, visits: 8 },
            { date: '2023-01-16', value: 15, visits: 7 },
            { date: '2023-01-17', value: 0, visits: 0 },
        ]);
    });

    test('should fill empty intervals with previous value', () => {
        const options: DateGroupingOptions<typeof sampleData[0]> = {
            ...baseOptions,
            timeGrouping: 'days',
            operation: 'sum',
            emptyIntervalFill: 'previous',
            startDate: '2023-01-14',
            endDate: '2023-01-17',
        };

        const result = groupByDate(sampleData, options);

        expect(result).toEqual([
            { date: '2023-01-14', value: 0, visits: 0 },
            { date: '2023-01-15', value: 30, visits: 8 },
            { date: '2023-01-16', value: 15, visits: 7 },
            { date: '2023-01-17', value: 15, visits: 7 },
        ]);
    });
    //   failed
    test('should handle weekly grouping', () => {
        const options: DateGroupingOptions<typeof sampleData[0]> = {
            ...baseOptions,
            timeGrouping: 'weeks',
            emptyIntervalFill: 0,
            operation: 'sum',
        };

        const result = groupByDate(sampleData, options);

        // Week starts on Sunday (2023-01-15 is Sunday)
        expect(result).toEqual([
            { date: '2023-01-15', value: 45, visits: 15 },
            { date: '2023-01-22', value: 0, visits: 0 },
            { date: '2023-01-29', value: 30, visits: 2 },
            { date: '2023-02-05', value: 0, visits: 0 },
            { date: '2023-02-12', value: 25, visits: 4 }
        ]);
    });
    test('should handle weekly groupin by date formate ', () => {
        const options: DateGroupingOptions<typeof sampleData[0]> = {
            ...baseOptions,
            timeGrouping: 'YYYY-MM-WW',
            emptyIntervalFill: 0,
            operation: 'sum',
        };

        const result = groupByDate(sampleData, options);

        // Week starts on Sunday (2023-01-15 is Sunday)
        expect(result).toEqual([
            { date: '2023-01-02', value: 30, visits: 8 },
            { date: '2023-01-03', value: 15, visits: 7 },
            { date: '2023-01-04', value: 0, visits: 0 },
            { date: '2023-02-05', value: 30, visits: 2 },
            { date: '2023-02-06', value: 0, visits: 0 },
            { date: '2023-02-07', value: 25, visits: 4 }
          ]);
    });

    test('should handle hourly grouping', () => {
        const options: DateGroupingOptions<typeof sampleData[0]> = {
            ...baseOptions,
            timeGrouping: 'hours',
            operation: 'sum',
        };

        const result = groupByDate(sampleData, options);

        expect(result).toEqual([
            { date: '2023-01-15T10', value: 10, visits: 5 },
            { date: '2023-01-15T11', value: 20, visits: 3 },
            { date: '2023-01-16T09', value: 15, visits: 7 },
            { date: '2023-02-01T14', value: 30, visits: 2 },
            { date: '2023-02-15T16', value: 25, visits: 4 },
        ]);
    });

    test('should handle max operation', () => {
        const options: DateGroupingOptions<typeof sampleData[0]> = {
            ...baseOptions,
            timeGrouping: 'days',
            operation: 'max',
        };

        const result = groupByDate(sampleData, options);

        expect(result).toEqual([
            { date: '2023-01-15', value: 20, visits: 5 },
            { date: '2023-01-16', value: 15, visits: 7 },
            { date: '2023-02-01', value: 30, visits: 2 },
            { date: '2023-02-15', value: 25, visits: 4 },
        ]);
    });

    test('should handle min operation', () => {
        const options: DateGroupingOptions<typeof sampleData[0]> = {
            ...baseOptions,
            timeGrouping: 'days',
            operation: 'min',
        };

        const result = groupByDate(sampleData, options);

        expect(result).toEqual([
            { date: '2023-01-15', value: 10, visits: 3 },
            { date: '2023-01-16', value: 15, visits: 7 },
            { date: '2023-02-01', value: 30, visits: 2 },
            { date: '2023-02-15', value: 25, visits: 4 },
        ]);
    });

    test('should handle count operation', () => {
        const options: DateGroupingOptions<typeof sampleData[0]> = {
            ...baseOptions,
            timeGrouping: 'days',
            operation: 'count',
        };

        const result = groupByDate(sampleData, options);

        expect(result).toEqual([
            { date: '2023-01-15', count: 2 },
            { date: '2023-01-16', count: 1 },
            { date: '2023-02-01', count: 1 },
            { date: '2023-02-15', count: 1 },
        ]);
    });

    test('should handle monthly with long month names', () => {
        const options: DateGroupingOptions<typeof sampleData[0]> = {
            ...baseOptions,
            timeGrouping: 'months',
        };

        const result = groupByDate(sampleData, options);

        expect(result).toEqual([
            { date: '2023-01', value: 45, visits: 15 },
            { date: '2023-02', value: 55, visits: 6 },
        ]);
    });

    test('should handle invalid dates gracefully', () => {
        const invalidData = [
            { id: 1, date: 'Invalid Date', value: 10 },
            { id: 2, date: '2023-01-15', value: 20 },
        ];

        const options: DateGroupingOptions<typeof invalidData[0]> = {
            dateField: 'date',
            valueFields: ['value'],
            timeGrouping: 'days',
        };

        const result = groupByDate(invalidData, options);

        expect(result).toEqual([
            { date: '2023-01-15', value: 20 },
        ]);
    });
});