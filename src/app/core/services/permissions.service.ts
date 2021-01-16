import {Injectable} from '@angular/core';
import {Roles} from '@app/core/model/roles.model';
import {TokenService} from '@app/core';

@Injectable({
    providedIn: 'root'
})
export class PermissionsService {

    private _userType: Roles.Admin | Roles.Klant | Roles.Team;

    constructor(
        private tokenService: TokenService
    ) {
        this._userType = Number(tokenService.payload && tokenService.payload['type']);
    }

    reload() {
        this._userType = Number(this.tokenService.payload && this.tokenService.payload['type']);
    }

    isAdminUser(): boolean {
        return this._userType === Roles.Admin ? true : false;
    }

    isKlantUser(): boolean {
        return this._userType === Roles.Klant ? true : false;
    }

    isTeamUser(): boolean {
        return this._userType === Roles.Team ? true : false;
    }

    get userType() {
        return this._userType;
    }
}
