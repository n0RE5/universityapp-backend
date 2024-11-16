export default function getWeekNumber(date: Date): number {
    const onejan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil((((+date - +onejan) / 86400000) + onejan.getDay() + 1) / 7);
}