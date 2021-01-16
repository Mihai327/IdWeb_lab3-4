import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import BaseComponentClass from '@app/core/class/BaseComponent.class';
import {AuthService} from '@app/core';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent extends BaseComponentClass implements OnInit {
    form: FormGroup;
    errorMessage;
    success = false;

    constructor(private formBuilder: FormBuilder,
                private authService: AuthService) {
        super();
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            email: ['', {validators: [Validators.required, Validators.email], updateOn: 'blur'}],
        });
    }

    onSubmit() {
        if (!this.form.valid) {
            return this.errorMessage = 'The email is invalid';
        }

        const body = this.form.value;
        this.form.disable();
        this.subscriptions.sink = this.authService.forgot(body).subscribe(result => {
            this.success = true;
        }, () => {
            this.form.enable();
            return this.errorMessage = 'The email is invalid';
        });
    }

    get email(): AbstractControl {
        return this.form.get('email');
    }
}
