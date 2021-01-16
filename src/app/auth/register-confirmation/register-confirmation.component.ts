import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import BaseComponentClass from '@app/core/class/BaseComponent.class';
import {AuthService} from '@app/core';
import {ActivatedRoute} from '@angular/router';
import {MustMatch} from '@app/shared/form/custom-validator.class';

@Component({
    selector: 'app-register-confirm',
    templateUrl: './register-confirmation.component.html',
    styleUrls: ['./register-confirmation.component.scss']
})
export class RegisterConfirmationComponent extends BaseComponentClass implements OnInit {
    form: FormGroup;
    errorMessage;
    successMessage;
    isSuccessConfirmation;
    isDoneTokenCheck = false;
    isDoneConfirmation = false;
    isValidToken = false;

    passwordErrorMessages = {
        pattern: 'Dit wachtwoord is niet geldig',
        mustMatch: 'Het controle wachtwoord moet hetzelfde zijn als het wachtwoord'
    };

    private token: string;

    constructor(
        private activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        private authService: AuthService
    ) {
        super();
    }

    ngOnInit(): void {
        this.token = this.activatedRoute.snapshot.params.token;
        this.checkToken();
    }

    onSubmit() {
        if (!this.form.valid) {
            return this.form.markAllAsTouched();
        }

        const body = {
            ...this.form.value,
            token: this.token
        };
        this.subscriptions.sink = this.authService.confirmUser(body).subscribe(result => {
            this.isDoneConfirmation = true;
            this.isSuccessConfirmation = true;
        }, err => {
            this.isDoneConfirmation = true;
            this.isSuccessConfirmation = false;
            this.errorMessage = err.error.data || err.error.errors;
        });


    }

    private checkToken() {
        if (!this.token) {
            return this.errorMessage = 'The token is invalid';
            this.isDoneTokenCheck = true;
            this.isValidToken = false;
        }

        this.subscriptions.sink = this.authService.checkRegisterToken(this.token).subscribe(result => {
            this.initForm();
            this.isDoneTokenCheck = true;
            this.isValidToken = true;
        }, error => {
            this.errorMessage = error.error.data;
            this.isDoneTokenCheck = true;
            this.isValidToken = false;

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
}
