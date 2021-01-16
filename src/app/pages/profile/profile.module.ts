import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileComponent} from './profile.component';
import {RouterModule} from '@angular/router';
import {ImageCropperModule} from 'ngx-image-cropper';

import {ProfileRoutes} from '@app/pages/profile/profile.routes';
import {ProfileEditDialogComponent} from './profile-edit-dialog/profile-edit-dialog.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedFormModule} from '@app/shared/form/shared-form.module';
import {ProfileImageDialogComponent} from '@app/pages/profile/profile-image-dialog/profile-image-dialog.component';
import {ProfilePasswordDialogComponent} from '@app/pages/profile/profile-password-dialog/profile-password-dialog.component';


@NgModule({
    declarations: [
        ProfileComponent,
        ProfileEditDialogComponent,
        ProfileImageDialogComponent,
        ProfilePasswordDialogComponent
    ],
    exports: [
        ProfileEditDialogComponent,
        ProfileImageDialogComponent,
        ProfilePasswordDialogComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(ProfileRoutes),
        ReactiveFormsModule,
        FormsModule,
        SharedFormModule,
        ImageCropperModule
    ]
})
export class ProfileModule {
}
