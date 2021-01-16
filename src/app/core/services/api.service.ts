import {Injectable} from '@angular/core';

import {Observable, throwError as _throw} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {AuthService, TokenService} from '../auth';
import {UtilService} from './util.service';
import {ApiResponse} from '../../app';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(
        private authSvc: AuthService,
        private httpClient: HttpClient,
        private tokenSvc: TokenService,
        private utilSvc: UtilService
    ) {
    }

    get(path: string,
        params: { [param: string]: string } = {},
        options = {}): Observable<any> {
        const optionsParam = this.utilSvc.buildHttpRequestOptions(params);
        options = Object.assign(optionsParam, options);
        return this.httpClient.get<ApiResponse>(
            this.utilSvc.buildUrl(path),
            options,
        )
            // We need to use an arrow function for calling the `onError` function, because
            // if we call it directly ( `catch(this.onError(err))` ), then
            // the `this` reference is lost in the catch handler (`onError` function).
            .pipe(
                catchError((err: HttpErrorResponse) => this.onError(err)),
                map((resp: ApiResponse) => this.onSuccess(resp))
            );
    }

    delete(path: string,
           params: { [param: string]: string } = {}): Observable<any> {
        return this.httpClient.delete<ApiResponse>(
            this.utilSvc.buildUrl(path),
            this.utilSvc.buildHttpRequestOptions(params)
        )
            // We need to use an arrow function for calling the `onError` function, because
            // if we call it directly ( `catch(this.onError(err))` ), then
            // the `this` reference is lost in the catch handler (`onError` function).
            .pipe(
                catchError((err: HttpErrorResponse) => this.onError(err)),
                map((resp: ApiResponse) => this.onSuccess(resp))
            );
    }

    post(path: string,
         body: {} = {},
         params: { [param: string]: string } = {}
    ): Observable<any> {
        return this.httpClient.post(
            this.utilSvc.buildUrl(path),
            params['forFile'] ? body : JSON.stringify(body),
            this.utilSvc.buildHttpRequestOptions(params)
        ).pipe(
            catchError((err: HttpErrorResponse) => this.onError(err)),
            map((resp: ApiResponse) => this.onSuccess(resp))
        );
    }

    patch(path: string,
          body: {} = {},
          params: { [param: string]: string } = {}
    ): Observable<any> {
        return this.httpClient.patch(
            this.utilSvc.buildUrl(path),
            params['forFile'] ? body : JSON.stringify(body),
            this.utilSvc.buildHttpRequestOptions(params)
        ).pipe(
            catchError((err: HttpErrorResponse) => this.onError(err)),
            map((resp: ApiResponse) => this.onSuccess(resp))
        );
    }

    put(path: string,
        body: {} = {},
        params: { [param: string]: string } = {}
    ): Observable<any> {
        return this.httpClient.put<ApiResponse>(
            this.utilSvc.buildUrl(path),
            JSON.stringify(body),
            this.utilSvc.buildHttpRequestOptions(params)
        ).pipe(
            catchError((err: HttpErrorResponse) => this.onError(err)),
            map((resp: ApiResponse) => this.onSuccess(resp))
        );
    }

    postFile(path, data, params = {}) {
        return this.httpClient.post(
            this.utilSvc.buildUrl(path),
            data,
            this.utilSvc.buildHttpRequestOptions(params))
            .pipe(
                catchError((err: HttpErrorResponse) => this.onError(err)),
                map((resp: any) => this.onSuccess(resp))
            );
    }


    checkTokenExpired(err: HttpErrorResponse): boolean {
        if (err && err.status && err.status === 401) {
            // Logout user.
            this.authSvc.logout(true);

            return true;
        }

        return false;
    }

    private onSuccess(resp: ApiResponse): Observable<ApiResponse> {

        // Replace old token to the new one if exists.
        if (resp.data && resp.data.token) {
            this.tokenSvc.token = resp.data.token;
        }

        // NOTE\TODO: Maybe we can delete the `success` property from the response.
        return 'data' in resp && resp.data || resp.success;
    }

    private onError(err: HttpErrorResponse): Observable<any> {
        if (this.tokenSvc.token) {
            this.checkTokenExpired(err);
        }

        return _throw(err);
    }
}
