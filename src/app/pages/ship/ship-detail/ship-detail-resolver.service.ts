import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
    Router
} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Maintenance} from '@app/core/model/maintenance.model';
import {Injectable} from '@angular/core';
import ShipService from '@app/core/services/rest/ship.service';

@Injectable()
export class ShipDetailResolverService implements Resolve<Maintenance> {
    constructor(
        private shipService: ShipService,
        private router: Router
    ) {
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
        const id = +route.paramMap.get('id');

        return id > 0 && this.shipService.getShipItem(id).pipe(
            catchError(err => {
                this.router.navigate(['/administrator/ships']);
                return of([]);
            })
        );
    }
}
