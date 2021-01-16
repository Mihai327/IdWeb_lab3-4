import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {Subject, concat, of} from 'rxjs';
import {
    catchError,
    distinctUntilChanged,
    map,
    tap,
    switchMap,
} from 'rxjs/operators';
import CompanyService from '@app/core/services/rest/company.service';

@Component({
    selector: 'app-company',
    templateUrl: './company.component.html',
    styleUrls: ['./company.component.scss'],
})
export class CompanyComponent implements OnInit {
    companyInput$ = new Subject<string>();
    company$;
    companiesLoading: boolean;
    selectedCompany;

    @Output() selectCompany = new EventEmitter();

    constructor(private companyService: CompanyService) {
    }

    ngOnInit(): void {
        this.loadCompanies();
    }

    private loadCompanies() {
        this.company$ = concat(
            of([]), // default items
            this.companyInput$.pipe(
                distinctUntilChanged(),
                tap(() => (this.companiesLoading = true)),
                switchMap((term) => {
                    const params = (term && {search: term}) || {};
                    return this.companyService
                        .getCompanies({...params, fields: 'id,name'})
                        .pipe(
                            map((resp: any) => resp.data),
                            catchError(() => of([])), // empty list on error
                            tap(() => (this.companiesLoading = false))
                        );
                })
            )
        );
    }

    trackByFn(item: any) {
        return item.id;
    }

    onSelectCompany() {
        this.selectCompany.emit(this.selectedCompany);
    }
}
