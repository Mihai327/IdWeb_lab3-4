import {Injectable} from '@angular/core';
import {ApiService, UtilService} from '@app/core';
import {Observable} from 'rxjs';
import {Company} from '@app/core/model/company.model';
import {map} from 'rxjs/operators';

const COMPANY_URL = 'companies';

@Injectable({
    providedIn: 'root'
})
export default class CompanyService {
    constructor(
        private utilService: UtilService,
        private apiService: ApiService) {
    }

    getCompanies(params = {}): Observable<Company[]> {
        return this.apiService.get(COMPANY_URL, params)
            .pipe(
                map((resp: any) => resp)
            );
    }

    createCompany(body) {
        return this.apiService.post(COMPANY_URL, body, {forFile: 'true'});
    }

    updateCompany(id: number, body) {
        const url = `${COMPANY_URL}/${id}`;
        return this.apiService.post(url, body, {forFile: 'true'});
    }

    deleteCompany(id: number) {
        const url = `${COMPANY_URL}/${id}`;
        return this.apiService.delete(url);
    }

    activateCompany(id: number) {
        const url = `${COMPANY_URL}/activate/${id}`;
        return this.apiService.post(url);
    }
}
