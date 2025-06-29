import groupByProperty from '../src/groupByProperty';
import { PropertyGroupingOptions } from '../src/commonTypes';

describe('groupByProperty', () => {
    const sampleData = [
        { id: 1, brand: 'iphone', value: 10, visits: 5 },
        { id: 2, brand: 'iphone', value: 20, visits: 3 },
        { id: 3, brand: 'android', value: 15, visits: 7 },
        { id: 4, brand: 'android', value: 30, visits: 2 },
        { id: 5, brand: 'motorola', value: 25, visits: 4 },
    ];

    const baseOptions: PropertyGroupingOptions<typeof sampleData[0]> = {
        groupBy: 'brand',
        valueFields: ['value', 'visits'],
    };

    test('should group by daily with sum operation', () => {
        const options: PropertyGroupingOptions<typeof sampleData[0]> = {
            ...baseOptions,
            operation: 'sum',
        };

        const result = groupByProperty(sampleData, options);

        expect(result).toEqual([
            { brand: 'android', value: 45, visits: 9 },
            { brand: 'iphone', value: 30, visits: 8 },
            { brand: 'motorola', value: 25, visits: 4 },
        ]);
    });
});