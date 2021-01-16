import {Component, OnInit} from '@angular/core';
import {ProfileService} from '@app/core/services/rest/profile.service';
import BaseComponentClass from '@app/core/class/BaseComponent.class';
import {ConfirmationDialogComponent} from '@app/shared/confirmation-dialog/confirmation-dialog.component';
import {CompanyConstants} from '@app/pages/administrator/company/company.const';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ProfileEditDialogComponent} from '@app/pages/profile/profile-edit-dialog/profile-edit-dialog.component';
import {environment} from '@env/environment.prod';
import {ProfileImageDialogComponent} from '@app/pages/profile/profile-image-dialog/profile-image-dialog.component';
import {ProfilePasswordDialogComponent} from '@app/pages/profile/profile-password-dialog/profile-password-dialog.component';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends BaseComponentClass implements OnInit {
    profile;

    constructor(private profileService: ProfileService,
                private modalService: NgbModal) {
        super();
    }

    ngOnInit(): void {
        this.subscriptions.sink = this.profileService.profile$.subscribe(profile => {
            this.profile = profile;
        });
    }

    onEditProfile() {
        const modalRef = this.modalService.open(ProfileEditDialogComponent);
        modalRef.componentInstance.profile = this.profile;

        modalRef.result.then((result) => {
            if (result) {
                this.profileService.setProfile(result.profile);
            }
        });
    }

    onFileChanged(event) {
        const file = <File>event.target.files[0];
        this.openImageDialog(file);
    }

    openImageDialog(file: File) {
        const modalRef = this.modalService.open(ProfileImageDialogComponent);
        modalRef.componentInstance.profileImage = file;

        modalRef.result.then(result => {
            if (result) {
                this.profileService.setProfile(result.profile);
            }
        });
    }

    openPasswordDialog() {
        const modalRef = this.modalService.open(ProfilePasswordDialogComponent);
    }

    get profileImage() {
        return this.profile && this.profile.profile_picture
            ? environment.sourceUrl + this.profile.profile_picture
            : 'assets/images/profile/empty.png';
    }
}
