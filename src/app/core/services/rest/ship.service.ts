import {Injectable} from '@angular/core';
import {ApiService, UtilService} from '@app/core';
import {Observable} from 'rxjs';
import {Ship} from '@app/core/model/ship.model';
import {map} from 'rxjs/operators';

const SHIP_URL = 'ships';

@Injectable({
    providedIn: 'root',
})
export default class ShipService {
    constructor(
        private utilService: UtilService,
        private apiService: ApiService
    ) {
    }

    getShips(params = {}): Observable<Ship[]> {
        return this.apiService
            .get(SHIP_URL, params)
            .pipe(map((resp: any) => resp));
    }

    createShip(body) {
        return this.apiService.post(SHIP_URL, body, {forFile: 'true'});
    }

    getShipItem(id: number, params = {}): Observable<Ship> {
        const defaultParams = {expand: 'products'};
        return this.apiService
            .get(`${SHIP_URL}/${id}`, Object.assign(defaultParams, params))
            .pipe(map((resp: any) => resp));
    }

    updateShip(id: number, body) {
        const url = `${SHIP_URL}/${id}`;
        return this.apiService.post(url, body, {forFile: 'true'});
    }

    deleteShip(id: number) {
        const url = `${SHIP_URL}/${id}`;
        return this.apiService.delete(url);
    }
}
