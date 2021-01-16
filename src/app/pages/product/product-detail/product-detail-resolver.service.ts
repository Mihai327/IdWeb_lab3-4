import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
    Router
} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Product} from '@app/core/model/product.model';
import {Injectable} from '@angular/core';
import ProductService from '@app/core/services/rest/product.service';

@Injectable()
export class ProductDetailResolverService implements Resolve<Product> {
    constructor(
        private productService: ProductService,
        private router: Router
    ) {
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
        const id = +route.paramMap.get('id');

        return id > 0 && this.productService.getProductItem(id).pipe(
            catchError(err => {
                this.router.navigate(['/administrator/products']);
                return of([]);
            })
        );
    }
}
