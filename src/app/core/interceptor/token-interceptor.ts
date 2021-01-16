import {Injectable} from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';

import {TokenService} from '../auth';
import {isNullOrUndefined} from 'util';
import {Observable} from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(
        private tokenSvc: TokenService,
        private router: Router) {
    }

    addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
        return req.clone({setHeaders: {Authorization: 'Bearer ' + token}});

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!isNullOrUndefined(this.tokenSvc.token)) {
            request = this.addToken(request, this.tokenSvc.token);
        }
        return next.handle(request);
    }
}
