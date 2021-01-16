import {Injectable} from '@angular/core';
import {ApiService} from '@app/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

const WORKTYPES_URL = 'work/types';

@Injectable({
    providedIn: 'root',
})
export default class WorkTypesService {
    constructor(
        private apiService: ApiService
    ) {
    }

    getWorkTypes(params = {}): Observable<any[]> {
        return this.apiService
            .get(WORKTYPES_URL, params)
            .pipe(map((resp: any) => resp));
    }
}
