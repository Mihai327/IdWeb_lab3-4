import {Injectable} from '@angular/core';
import {ApiService, UtilService} from '@app/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {tap} from 'rxjs/operators';
import {ProfileService} from '@app/core/services/rest/profile.service';

@Injectable({
    providedIn: 'root',
})
export class SettingsService {
    private contactPerson = new BehaviorSubject<any>(null);
    contactPerson$ = this.contactPerson.asObservable();

    constructor(
        private profileService: ProfileService,
        private utilService: UtilService,
        private apiService: ApiService
    ) {
    }

    setContactPerson(profile: any) {
        this.contactPerson.next(profile);
    }

    getSettings() {
        return this.apiService.get('settings')
            .pipe(
                tap(res => {
                    this.profileService.setProfile(res.profile);
                    this.setContactPerson(res.contact_person);
                })
            );
    }
}
