import { TreesPerDay } from "../types/treesPerDay";
import { TreesResponse } from "../types/treesResponse";

interface TimeDict {
    [key: string]: number;
}

interface DaysDict {
    [key: string]: number;
}

const ensureAmountIsString = (amount: number | string) => amount ? amount.toString() : '0';

const splitTreesResult = (data: [number | string, number][]): TimeDict => {
    const timeDict = data.reduce<TimeDict>((dict, current) => {
        const [amount, day] = current;
        // have to convert amount to string then to number again since sometimes data has string values
        const stringifiedAmount = ensureAmountIsString(amount);
        if (!dict[day]) {
            dict[day] = parseInt(stringifiedAmount);
        } else {
            dict[day] +=  parseInt(stringifiedAmount);
        }
        return dict
    }, {});

    return timeDict;
};

const parseIntoDayString = (ms: string) => {
    const date = new Date(0);
    date.setUTCSeconds(parseInt(ms));
    return date.toDateString();
}

const splitIntoDays = (timeDict: TimeDict): DaysDict => {
    const daysDict = Object.keys(timeDict).reduce<DaysDict>((dict, current) => {
        const amount = timeDict[current];
        const day = parseIntoDayString(current);
        if (!dict[day]) {
            dict[day] = amount;
        } else {
            dict[day] += amount;
        }
        return dict;
    }, {})
    return daysDict;
}

const parseData = (data: [number, number][]): TreesPerDay[] => {
    const timeDict = splitTreesResult(data);
    const daysDict = splitIntoDays(timeDict);
    return Object.keys(daysDict).map((key) => ({
        day: key,
        trees: daysDict[key]
    }));
}

const getFilterDate = (daysPast: number) => {
    const today = new Date();
    const filter = new Date(new Date().setDate(today.getDate() - daysPast));
    return filter;
}

const filterDays = (day: TreesPerDay, filterDate: Date) => {
    const currentDayDate = new Date(day.day);
    
    return currentDayDate > filterDate;
}

export {
    splitTreesResult,
    parseIntoDayString,
    splitIntoDays,
    parseData,
    filterDays,
    getFilterDate
}