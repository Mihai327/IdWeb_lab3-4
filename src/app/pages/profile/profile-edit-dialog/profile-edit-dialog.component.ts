import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import BaseComponentClass from '@app/core/class/BaseComponent.class';
import {ProfileService} from '@app/core/services/rest/profile.service';

@Component({
    selector: 'app-profile-edit-dialog',
    templateUrl: './profile-edit-dialog.component.html',
    styleUrls: ['./profile-edit-dialog.component.scss']
})
export class ProfileEditDialogComponent extends BaseComponentClass implements OnInit {
    @Input() profile;

    form: FormGroup;

    constructor(public activeModal: NgbActiveModal,
                private formBuilder: FormBuilder,
                private profileService: ProfileService) {
        super();
    }

    ngOnInit(): void {
        this.initForm();
        this.patchForm();
    }

    private initForm() {
        this.form = this.formBuilder.group({
            first_name: ['', {validators: [Validators.required], updateOn: 'blur'}],
            last_name: ['', {validators: [Validators.required], updateOn: 'blur'}],
            email: ['', {validators: [Validators.required, Validators.email], updateOn: 'blur'}],
            phone: ['', {validators: [Validators.required], updateOn: 'blur'}]
        });
    }

    onSubmit() {
        if (!this.form.valid) {
            return this.form.markAllAsTouched();
        }

        const body = this.prepareBody();
        this.subscriptions.sink = this.profileService.editProfile(body)
            .subscribe((result: any) => {
                this.activeModal.close({profile: result});
            });
    }

    private patchForm() {
        this.form.patchValue(this.profile);
    }

    private prepareBody() {
        return this.form.value;
    }

}
