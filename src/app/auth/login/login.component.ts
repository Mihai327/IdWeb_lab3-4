import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import {AuthService} from '@app/core';
import BaseComponentClass from '@app/core/class/BaseComponent.class';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponentClass implements OnInit {
    form: FormGroup;
    errorMessage;

    constructor(
        private authService: AuthService,
        private fb: FormBuilder,
        private router: Router) {
        super();
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            email: ['', {validators: [Validators.required, Validators.email], updateOn: 'blur'}],
            password: ['', {validators: [Validators.required], updateOn: 'blur'}]
        });
    }

    onSubmit() {
        if (!this.form.valid) {
            return this.errorMessage = 'The credentials are invalid';
        }

        const body = this.form.value;
        this.form.disable();
        this.subscriptions.sink = this.authService.login(body).subscribe(result => {
            this.router.navigate(['/dashboard']);
        }, () => {
            this.form.enable();
            return this.errorMessage = 'Het emailadres of wachtwoord is incorrect';
        });
    }

    get email(): AbstractControl {
        return this.form.get('email');
    }

    get password(): AbstractControl {
        return this.form.get('password');
    }

}
