import {Injectable} from '@angular/core';
import {ApiService} from '@app/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

const MAINTENANCE_COMMENT_URL = 'maintenances/comment';

@Injectable({
    providedIn: 'root',
})
export default class MaintenanceCommentService {
    constructor(
        private apiService: ApiService
    ) {
    }

    createComment(body): Observable<any[]> {
        return this.apiService
            .post(MAINTENANCE_COMMENT_URL, body)
            .pipe(map((resp: any) => resp));
    }
}
