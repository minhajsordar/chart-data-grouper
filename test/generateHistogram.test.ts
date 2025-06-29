import generateHistogram from '../src/generateHistogram';
import { HistogramOptions } from '../src/commonTypes';

describe('generateHistogram', () => {
    const sampleData = [
        { name: 'muhammad', age: 10 },
        { name: 'minhaj', age: 20 },
        { name: 'rohan', age: 15 },
        { name: 'ismael', age: 30 },
        { name: 'david', age: 25 },
    ];

    const baseOptions: HistogramOptions<typeof sampleData[0]> = {
        valueField: 'age',
    };

    test('should group by daily with sum operation', () => {
        const options: HistogramOptions<typeof sampleData[0]> = {
            ...baseOptions,
            bins: 5,
        };

        const result = generateHistogram(sampleData, options);

        expect(result).toEqual([{
            bins: [
                {
                    range: "10-14",
                    count: 1
                },
                {
                    range: "14-18",
                    count: 1
                },
                {
                    range: "18-22",
                    count: 1
                },
                {
                    range: "22-26",
                    count: 1
                },
                {
                    range: "26-30",
                    count: 0
                }
            ],
            total: 5
        }]);
    });
});