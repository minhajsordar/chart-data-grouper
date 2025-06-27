// Utility function
export default function getValueByPath<T = any>(obj: any, path: string): T | undefined {
    return path.split('.').reduce((o, p) => o?.[p], obj);
}