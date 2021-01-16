import {Inject, Injectable} from '@angular/core';

import {WINDOW} from '../window-factory';
import {TokenPayload} from './auth';

@Injectable()
export class TokenService {

    private ls: any;
    private _token: string;
    private _payload: TokenPayload;

    constructor() {
        this.ls = window.localStorage;
    }

    get token(): string {
        return this._token || this.ls.jwtToken;
    }

    set token(token: string) {
        this.ls.jwtToken = token;
        this.parseToken();
    }

    get payload(): TokenPayload {
        return this._payload;
    }

    destroyToken() {
        this.ls.removeItem('jwtToken');
        this._token = this._payload = null;
    }

    parseToken(): boolean {
        this._token = this.ls.jwtToken;

        if (this._token) {

            // Decode token payload from Base64.
            const tokenPayload: string = atob(this._token.split('.')[1] || '');

            if (tokenPayload) {
                try {
                    // Parse token from JSON.
                    this._payload = JSON.parse(tokenPayload);

                    // Check existence of required properties.
                    if (('exp' in this._payload)) {

                        // Convert the JWT token expiration time from seconds (PHP format) to millisecond (javascript format).
                        this._payload.exp *= 1000;

                        return true;
                    }
                } catch (e) {
                }
            }
        }

        return false;
    }


}
