import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '@app/core';
import BaseComponentClass from '@app/core/class/BaseComponent.class';
import {ActivatedRoute} from '@angular/router';
import {MustMatch} from '@app/shared/form/custom-validator.class';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent extends BaseComponentClass implements OnInit {
    form: FormGroup;
    errorMessage;
    success = false;
    loading = true;
    token: string;
    tokenError;

    passwordErrorMessages = {
        pattern: 'Dit wachtwoord is niet geldig',
        mustMatch: 'Het controle wachtwoord moet hetzelfde zijn als het wachtwoord'
    };

    constructor(private activatedRoute: ActivatedRoute,
                private formBuilder: FormBuilder,
                private authService: AuthService) {
        super();
    }

    ngOnInit(): void {
        this.token = this.activatedRoute.snapshot.params.token;
        this.checkToken();
    }

    private checkToken() {
        if (!this.token) {
            return this.tokenError = true;
        }

        this.subscriptions.sink = this.authService.checkForgotPasswordToken(this.token).subscribe(result => {
            this.initForm();
            this.loading = false;
        }, error => {
            this.loading = false;
            this.tokenError = true;
        });
    }

    onSubmit() {
        if (!this.form.valid) {
            return this.form.markAllAsTouched();
        }

        const body = this.prepareBody();

        this.form.disable();
        this.subscriptions.sink = this.authService.reset(body).subscribe(result => {
            this.success = true;
        }, () => {
            this.form.enable();
            return this.errorMessage = 'Something went wrong!';
        });
    }

    private initForm() {
        this.form = this.formBuilder.group({
                password: ['', {validators: [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/)]}],
                confirm_password: ['', {validators: [Validators.required]}]
            },
            {
                validator: MustMatch('password', 'confirm_password')
            });
    }

    get password(): AbstractControl {
        return this.form.get('password');
    }

    get confirmPassword(): AbstractControl {
        return this.form.get('confirm_password');
    }

    get showForm() {
        return !this.loading && !this.tokenError && !this.success;
    }

    private prepareBody() {
        const values = this.form.value;
        values.token = this.token;
        return values;
    }
}
