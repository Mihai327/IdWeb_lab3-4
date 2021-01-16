import {Injectable} from '@angular/core';
import {environment} from '@env/environment';
import * as moment from 'moment';
import {formatDate} from '@angular/common';

@Injectable()
export class UtilService {

    private baseHttpHeaders: { [header: string]: string } = {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    };

    buildUrl(path: string): string {
        return `${environment.apiUrl}/${path}`;
    }

    buildHttpRequestOptions(
        params: { [param: string]: string } = {}
    ): {
        headers: { [header: string]: string };
        params: { [param: string]: string };
    } {
        const forFile = params['forFile'] || false;
        delete params['forFile'];
        const httpHeadersObj = forFile
            //? { Accept: 'application/json',  'Content-Type': 'multipart/form-data' }
            ? null
            : this.baseHttpHeaders;

        return {
            headers: httpHeadersObj,
            params: params
        };
    }

    base64ToFile(base64Image: string): Blob {
        const split = base64Image.split(',');
        const type = split[0].replace('data:', '').replace(';base64', '');
        const byteString = atob(split[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i += 1) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], {type});
    }

    isEmptyOrNullObject(param) {
        return !param || Object.keys(param).length === 0 ? true : false;
    }

    getFormattedDate(datepicker, dateFormat = 'yyyy-MM-dd'): string {
        if (datepicker instanceof Object && ['year', 'month', 'day'].every(item => item in datepicker)) {
            const date = new Date(datepicker.year, datepicker.month - 1, datepicker.day);
            return formatDate(date, dateFormat, 'en');
        }
        return '';
    }

    formattedDateToObject(formattedDate: string) {
        const date = new Date(formattedDate);
        return {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    }
}
