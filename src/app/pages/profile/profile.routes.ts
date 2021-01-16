import {Routes} from '@angular/router';
import {AuthGuardService} from '@app/core';
import {ProfileComponent} from '@app/pages/profile/profile.component';

export const ProfileRoutes: Routes = [
    {
        path: '',
        component: ProfileComponent,
        canActivate: [AuthGuardService]
    }
];
