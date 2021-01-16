import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {ProfileService} from '@app/core/services/rest/profile.service';
import BaseComponentClass from '@app/core/class/BaseComponent.class';
import {UtilService} from '@app/core';

@Component({
    selector: 'app-profile-thumbnail-modal',
    templateUrl: './profile-image-dialog.component.html',
    styleUrls: ['./profile-image.dialog.component.scss']
})
export class ProfileImageDialogComponent extends BaseComponentClass implements OnInit {
    @Input() profileImage: File;

    imageChangedEvent: any = '';
    croppedImage: any = '';

    constructor(public activeModal: NgbActiveModal,
                private profileService: ProfileService,
                private utilService: UtilService
    ) {
        super();
    }

    ngOnInit(): void {
    }

    onSave() {
        const formData = new FormData();
        formData.append('profile_picture', this.utilService.base64ToFile(this.croppedImage), this.profileImage.name);

        this.subscriptions.sink = this.profileService.editProfileImage(formData).subscribe((result: any) => {
            this.activeModal.close({profile: result});
        });
    }

    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
    }
}
