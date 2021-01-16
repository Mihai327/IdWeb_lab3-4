import {Injectable} from '@angular/core';
import {ApiService, UtilService} from '@app/core';
import {Observable} from 'rxjs';
import {Company} from '@app/core/model/company.model';
import {map} from 'rxjs/operators';

const USER_URL = 'users';

@Injectable({
    providedIn: 'root'
})
export default class UserService {
    constructor(
        private utilService: UtilService,
        private apiService: ApiService) {
    }

    getUsers(params = {}): Observable<Company[]> {
        return this.apiService.get(USER_URL, params)
            .pipe(
                map((resp: any) => resp)
            );
    }

    getUsersForm() {
        return this.apiService.get(USER_URL + '/form')
            .pipe(
                map((resp: any) => resp)
            );
    }

    createUser(body) {
        return this.apiService.post(USER_URL, body, {forFile: 'true'});
    }

    deleteUser(id: number) {
        const url = `${USER_URL}/${id}`;
        return this.apiService.delete(url);
    }
    activateUser(id: number) {
        const url = `${USER_URL}/activate/${id}`;
        return this.apiService.post(url);
    }
}
