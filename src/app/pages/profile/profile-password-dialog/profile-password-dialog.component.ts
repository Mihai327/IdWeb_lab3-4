import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {ProfileService} from '@app/core/services/rest/profile.service';
import BaseComponentClass from '@app/core/class/BaseComponent.class';
import {MustMatch} from '@app/shared/form/custom-validator.class';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-password-change',
    templateUrl: './profile-password-dialog.component.html',
    styleUrls: ['./profile-password-dialog.component.scss']
})
export class ProfilePasswordDialogComponent extends BaseComponentClass implements OnInit {
    form: FormGroup;
    passwordErrorMessages = {
        patter: 'The new password invalid',
        mustMatch: 'The confimation passwor should be same as new passwerd'
    };
    errorMessage: string;

    constructor(public activeModal: NgbActiveModal,
                private toastr: ToastrService,
                private profileService: ProfileService,
                private fb: FormBuilder) {
        super();
    }

    ngOnInit(): void {
        this.initForm();
    }

    onSubmit() {
        if (!this.form.valid) {
            return this.form.markAllAsTouched();
        }

        const body = this.prepareBody();
        this.subscriptions.sink = this.profileService.editPassword(body).subscribe(response => {
            this.errorMessage = null;
            this.toastr.success('Password has been successfully changed');
            this.activeModal.close();
        }, err => {
            if (err.status === 400) {
                this.errorMessage = err.error.data;
            }
        });
    }

    initForm() {
        this.form = this.fb.group({
                password: ['', {validators: [Validators.required], updateOn: 'blur'}],
                new_password: ['', {
                    validators: [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/)],
                    updateOn: 'blur'
                }],
                confirm_password: ['', {validators: [Validators.required], updateOn: 'blur'}]
            },
            {
                validator: MustMatch('new_password', 'confirm_password')
            });
    }

    prepareBody() {
        return this.form.value;
    }
}
