import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';

import {throwError as observableThrowError, BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {TokenService} from './token.service';
import {UtilService} from '../services/util.service';
import {CredentialRegister, CredentialReset, Credentials} from './auth';
import {ApiResponse} from '@app/app';

@Injectable()
export class AuthService {

    private isAuthenticatedBS$ = new BehaviorSubject<boolean>(!!this.tokenSvc.token);
    public isAuthenticated$ = this.isAuthenticatedBS$.asObservable();

    // Store the URL so we can redirect after logging in.
    redirectUrl: string;

    constructor(private httpClient: HttpClient,
                private router: Router,
                private utilSvc: UtilService,
                private tokenSvc: TokenService,
    ) {
        if (this.tokenSvc.token) {

            let tokenExpired: boolean;

            // Remove any potential remnants of previous auth states,
            // when the JWT token exists and cannot be parsed
            // (maybe because was compromised in the `localstorage`) or it is expired.
            if (!this.tokenSvc.parseToken()
                || (tokenExpired = this.tokenSvc.payload.exp < new Date().getTime())) {
                this.logout(true);
            }
            // The JWT token is not expired and not compromised.
            else {

                // Set auth status to `true`.
                this.isAuthenticatedBS$.next(true);
            }
        }
    }

    /**
     * Log in with the passed credentials.
     * @param {Credentials} credentials
     * @returns {Observable<any>}
     */
    login(credentials: Credentials): Observable<any> {


        return this.httpClient.post(
            this.utilSvc.buildUrl('auth/login'),
            JSON.stringify(credentials),
            this.utilSvc.buildHttpRequestOptions()
        ).pipe(
            catchError((err: HttpErrorResponse) => observableThrowError(err)),
            map((resp: ApiResponse) => {
                try {
                    this.tokenSvc.token = resp.data;
                    this.isAuthenticatedBS$.next(true);
                } catch (e) {
                    return false;
                }

                return resp;
            })
        );
    }

    /**
     * Log out the user.
     * @param {boolean} isTokenExpired
     */
    logout(redirectToLogin = true): void {
        this.purgeAuth();
        if (redirectToLogin) {
            this.router.navigate(['/login']);
        }

    }

    /**
     * Chetk token validity.
     * @param {string} token
     * @returns {Observable<any>}
     */

    checkRegisterToken(token: string): Observable<any> {
        return this.httpClient.post(
            this.utilSvc.buildUrl('auth/register/check'),
            {token: token},
            this.utilSvc.buildHttpRequestOptions()
        ).pipe(
            catchError((err: HttpErrorResponse) => observableThrowError(err)),
            map((resp: ApiResponse) => {
                return resp;
            })
        );
    }

    confirmUser(body): Observable<any> {
        return this.httpClient.post(
            this.utilSvc.buildUrl('auth/register/confirm'),
            body,
            this.utilSvc.buildHttpRequestOptions()
        ).pipe(
            catchError((err: HttpErrorResponse) => observableThrowError(err)),
            map((resp: ApiResponse) => {
                return resp;
            })
        );
    }

    forgot(body): Observable<any> {
        return this.httpClient.post(
            this.utilSvc.buildUrl('auth/forgot'),
            body,
            this.utilSvc.buildHttpRequestOptions()
        ).pipe(
            catchError((err: HttpErrorResponse) => observableThrowError(err)),
            map((resp: ApiResponse) => {
                return resp;
            })
        );
    }

    checkForgotPasswordToken(token: string): Observable<any> {
        return this.httpClient.post(
            this.utilSvc.buildUrl('auth/forgot/check'),
            {token: token},
            this.utilSvc.buildHttpRequestOptions()
        ).pipe(
            catchError((err: HttpErrorResponse) => observableThrowError(err)),
            map((resp: ApiResponse) => {
                return resp;
            })
        );
    }

    /**
     * Chetk token validity.
     * @param {string} token
     * @returns {Observable<any>}
     */
    register(credentials: CredentialRegister): Observable<any> {
        return this.httpClient.post(
            this.utilSvc.buildUrl('auth/register'),
            JSON.stringify(credentials),
            this.utilSvc.buildHttpRequestOptions()
        ).pipe(
            catchError((err: HttpErrorResponse) => observableThrowError(err)),
            map((resp: ApiResponse) => {
                return resp;
            })
        );
    }

    reset(credentials: CredentialReset): Observable<any> {
        return this.httpClient.post(
            this.utilSvc.buildUrl('auth/reset'),
            JSON.stringify(credentials),
            this.utilSvc.buildHttpRequestOptions()
        ).pipe(
            catchError((err: HttpErrorResponse) => observableThrowError(err)),
            map((resp: ApiResponse) => {
                return resp;
            })
        );
    }


    /**
     * Clear the authentication data and set auth status to `false`.
     */
    purgeAuth(): void {
        // Remove the JWT token from localstorage.
        this.tokenSvc.destroyToken();

        // Set auth status to `false`.
        this.isAuthenticatedBS$.next(false);
    }

}
