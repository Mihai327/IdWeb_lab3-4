import {Injectable} from '@angular/core';
import {NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Injectable()
export class NgbDateNlParserFormatter extends NgbDateParserFormatter {
    parse(value: string): NgbDateStruct {
        const date = moment(value);
        return {year: +date.format('YYYY'), month:  +date.format('MM'), day:  +date.format('DD')};
    }

    format(date: NgbDateStruct): string {
        if (!date) {
            return '';
        }
        const momentDate = moment(`${date.year}/${date.month}/${date.day}`);
        return momentDate.format('DD-MM-YYYY');
    }
}
