import {Injectable} from '@nestjs/common';

@Injectable()
export class DatetimeService {
    constructor() {
    }
    static nowString(): string {
        return DatetimeService.formatDateString(new Date(Date.now()));
    }
    static now(): Date {
        const date: Date = new Date();
        const now_utc: number =  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
            date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
        return new Date(now_utc);
    }
    static dayStartString(date: Date): string {
        date.setUTCHours(0, 0, 0, 0);
        return this.formatDateString(date);
    }
    static dayEndString(date: Date): string {
        date.setUTCHours(23, 59, 59, 999);
        return this.formatDateString(date);
    }

    static formatDateString(date: Date): string {
        return `${date.getUTCFullYear()}-${DatetimeService.formatZeros(date.getUTCMonth() + 1)}-${DatetimeService.formatZeros(date.getUTCDate())} ${DatetimeService.formatZeros(date.getUTCHours())}:${DatetimeService.formatZeros(date.getUTCMinutes())}:${DatetimeService.formatZeros(date.getUTCSeconds())}`;
    }

    static formatZeros(target: number): string {
        return target < 10 ? `0${target}` : `${target}`;
    }

    static parseDate(date:string): Date { // in js date object months sequence start with 0 , so Jan is 0 , Dec - 11
        console.log(date);
        const values:string[] = date.split(' ');
        const dateValues:number[] = values[0].split('-').map(Number.parseFloat);
        if(values.length < 2) {
            return new Date(Date.UTC(dateValues[0],dateValues[1] - 1,dateValues[2]));
        }
        const timeValues:number[] = values[1].split(':').map(Number.parseFloat);
        return new Date(Date.UTC(dateValues[0],dateValues[1] - 1,dateValues[2], timeValues[0],timeValues[1],timeValues[2]));
    }
}