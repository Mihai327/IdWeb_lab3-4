import {Injectable} from '@angular/core';
import {ApiService, UtilService} from '@app/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    private profile = new BehaviorSubject<any>(null);
    profile$ = this.profile.asObservable();

    constructor(
        private utilService: UtilService,
        private apiService: ApiService
    ) {
    }

    setProfile(profile: any) {
        this.profile.next(profile);
    }

    getProfile() {
        return this.apiService.get('profile')
            .pipe(
                tap(res => this.profile.next(res))
            );
    }

    editProfile(body: any) {
        return this.apiService.post('profile', body);
    }

    editProfileImage(body: FormData) {
        return this.apiService.post('profile/picture', body, {forFile: 'true'});
    }

    editPassword(body: any) {
        return this.apiService.post('profile/password', body);
    }
}
