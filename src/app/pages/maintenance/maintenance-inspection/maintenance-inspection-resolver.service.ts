import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
    Router
} from '@angular/router';
import { MaintenanceService } from '@app/core/services/rest/maintenance.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Maintenance } from '@app/core/model/maintenance.model';
import { Injectable } from '@angular/core';

@Injectable()
export class MaintenanceInspectionResolverService implements Resolve<Maintenance> {
    constructor(
        private maintenanceService: MaintenanceService,
        private router: Router
        ) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
        const id = +route.paramMap.get('id');
        return id > 0 && this.maintenanceService.getMaintenanceItem(id).pipe(
            catchError(err => {
                this.router.navigate(['/maintenance/list']);
                return of([]);
            })
        );
    }
}
