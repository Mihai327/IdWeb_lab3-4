import {
    Component,
    OnInit,
    ViewChild,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';
import {NgForm} from '@angular/forms';
import {FilterField} from '@app/core/model/filter-field.model';
import {concat, of} from 'rxjs';
import {
    catchError,
    distinctUntilChanged,
    map,
    switchMap,
    tap,
} from 'rxjs/operators';
import {formatDate} from '@angular/common';

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
    @ViewChild('formFilter') formFilter: NgForm;

    @Input() fields: FilterField[] = [];
    @Input() cssOffsetClassesBtn = [''];
    @Output() filter = new EventEmitter<{}>();

    filterObject: { [key: string]: any } = {};
    optionsLoading = false;

    constructor() {
    }

    ngOnInit(): void {
        this.fields.forEach((field) => {
            this.filterObject[field.name] = field.value;
            if (field.key === 'typeahead') {
                this.typeahead(field);
            }
        });
    }

    onFilter() {
        const filterParams = {...this.filterObject};
        Object.keys(filterParams).forEach((prop) => {
            const value = filterParams[prop];

            if (
                value instanceof Object &&
                ['day', 'month', 'year'].every((item) => item in value)
            ) {
                const date = new Date(value.year, value.month - 1, value.day);
                filterParams[prop] = formatDate(
                    date,
                    this.fields.find((field) => field.name === prop).formatDate,
                    'en'
                );
            }

            if (value === null || value === undefined || value === '') {
                delete filterParams[prop];
            }
        });

        this.filter.emit(filterParams);
    }

    private typeahead(field: FilterField) {
        field.typeaheadOptions$ = concat(
            of(field.typeaheadDefaultOptions), // default items
            field.typeaheadInput$.pipe(
                distinctUntilChanged(),
                tap(() => (this.optionsLoading = true)),
                switchMap((term) => {
                    const params = (term && {search: term}) || {};
                    return field.typeaheadService[field.typeaheadMethod]({
                        ...field.typeaheadMethodParams,
                        ...params,
                    }).pipe(
                        map((resp: any) => resp.data),
                        catchError(() => of([])), // empty list on error
                        tap(() => (this.optionsLoading = false))
                    );
                })
            )
        );
    }
}
