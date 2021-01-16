import {Injectable} from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateChild,
    Data,
    Router,
    RouterStateSnapshot
} from '@angular/router';

import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';

import {AuthService} from './auth.service';
import {TokenService} from './token.service';

/**
 * This guard will check the user authentication and authorization for the activated route.
 */
@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {

    constructor(private router: Router,
                private authSvc: AuthService,
                private tokenSvc: TokenService,
    ) {
    }

    /**
     * @inheritDoc
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        // Check the activated route has the `chkTokenExp` flag in the data property.
        let chkTokenExp = !!route.data.chkTokenExp;

        // When the activated route, doesn't has the `chkTokenExp` flag, then
        // we find for the flag in the child routes data property until the first match.
        // This flag is mainly used for the routes that contains editable data (eg. forms).
        if (!chkTokenExp) {

            while (route.firstChild) {
                route = route.firstChild;

                if ((chkTokenExp = !!route.data.chkTokenExp)) {
                    break;
                }
            }
        }
        return this.isAuthenticated(route.data, state.url, chkTokenExp);
    }

    /**
     * @inheritDoc
     */
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.canActivate(route, state);
    }

    // canLoad(route: Route): Observable<boolean> {
    //     return this.isAuthenticated(route.data, `/${route.path}`);
    // }

    /**
     * Checks the user need authentication for the activated route.
     * @param {Data} routeData the route date object.
     * @param {string} url the activated url.
     * @param {boolean} chkTokenExp whether need to check the token expiration.
     * @returns {Observable<boolean>} whether the user is authenticated.
     */
    isAuthenticated(routeData: Data, url: string, chkTokenExp: boolean = false): Observable<boolean> {
        return this.authSvc.isAuthenticated$
            .pipe(
                take(1),
                map((isAuthenticated: boolean) => {
                    let tokenExpired: boolean;
                    // `withAuth` default value is true, which means all routes protected with this guard, which does not
                    // have a `withAuth` `Data` parameter, it can be accessed only by authenticated users.
                    const withAuth = ('withAuth' in routeData) ? routeData.withAuth : true;
                    const redirectToDashboard = ('redirectToDashboard' in routeData) ? routeData.withAuth : false;

                    // Restrict the access of the route, when the user is trying to reach a route which is not allowed
                    // (`withAuth = false`), when the user is authenticated (`isAuthenticated`).
                    if (!withAuth) {
                        if (isAuthenticated && redirectToDashboard) {
                            this.router.navigate(['/dashboard']);
                            return false;
                        }

                        if (isAuthenticated && !redirectToDashboard) {
                            this.authSvc.logout(false);
                            return true;
                        }
                    }
                        // Restrict the access of the route, when the user is not authenticated or the `chkTokenExp` flag is
                    // active for the activated route and the token is expired (NOTE: `withAuth = true`).
                    else if (
                        !isAuthenticated
                        || (chkTokenExp && (tokenExpired = this.tokenSvc.payload.exp <= new Date().getTime()))
                    ) {

                        // Store the attempted URL for redirecting
                        this.authSvc.redirectUrl = url;

                        // When the JWT token is expired, logout the current user.
                        if (tokenExpired) {
                            this.authSvc.logout(true);
                        }
                        // The user is not authenticated, redirect to the `sign-in` route.
                        else {
                            this.router.navigate(['/login']);
                        }

                        return false;
                    }

                    // Restrict the access of the route, when the user is authenticated, but
                    // not authorized to access the activated route.
                    if (
                        isAuthenticated
                        && !this.isAuthorized(routeData, true)) {
                        this.router.navigate(['/dashboard']);
                        return false;
                    }

                    return true;
                })
            );
    }

    /**
     * Checks the user authorization for the activated route, only when the user is authenticated.
     * @param {Data} routeData the route date object.
     * @returns {boolean} whether the route is authorized.
     */
    isAuthorized(routeData: Data, fromAuth = false) {
        const tokenPayload = this.tokenSvc.payload;

        if (routeData.minUserType && routeData.minUserType < +tokenPayload.type) {
            return false;
        }

        if (!tokenPayload) {
            return false;
        }

        return true;
    }
}
