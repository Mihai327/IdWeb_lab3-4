import {Injectable} from '@angular/core';
import {ApiService, UtilService} from '@app/core';
import {Observable} from 'rxjs';
import {Product} from '@app/core/model/product.model';
import {map} from 'rxjs/operators';

const PRODUCT_URL = 'products';

@Injectable({
    providedIn: 'root',
})
export default class ProductService {
    constructor(
        private utilService: UtilService,
        private apiService: ApiService
    ) {
    }

    getProducts(params = {}): Observable<Product[]> {
        return this.apiService
            .get(PRODUCT_URL, params)
            .pipe(map((resp: any) => resp));
    }

    getProductItem(id: number, params = {}): Observable<Product> {
        const httpParams = {expand: 'maintenances,maintenances.contact_person,maintenances.category,maintenances.status,documents'};
        return this.apiService
            .get(`${PRODUCT_URL}/${id}`, {...params, ...httpParams})
            .pipe(map((resp: any) => resp));
    }

    createProduct(body) {
        return this.apiService.post(PRODUCT_URL, body, {forFile: 'true'});
    }

    updateProduct(id: number, body) {
        const url = `${PRODUCT_URL}/${id}`;
        return this.apiService.post(url, body, {forFile: 'true'});
    }

    deleteProduct(id: number) {
        const url = `${PRODUCT_URL}/${id}`;
        return this.apiService.delete(url);
    }
}
