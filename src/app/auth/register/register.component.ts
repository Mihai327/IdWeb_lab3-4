import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import BaseComponentClass from '@app/core/class/BaseComponent.class';
import {AuthService} from '@app/core';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends BaseComponentClass implements OnInit {
    form: FormGroup;
    errorMessage;
    successMessage;

    constructor(
        private authService: AuthService,
        private formBuilder: FormBuilder
    ) {
        super();
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            name: ['', {validators: [Validators.required], updateOn: 'blur'}],
            email: ['', {validators: [Validators.required, Validators.email], updateOn: 'blur'}],
            contact_person: ['', {validators: [Validators.required], updateOn: 'blur'}]
        });
    }

    onSubmit() {
        if (!this.form.valid) {
            return this.form.markAllAsTouched();
        }

        const body = this.form.value;
        this.form.disable();
        this.subscriptions.sink = this.authService.register(body).subscribe(result => {
            this.form.reset();
            this.form.enable();
            this.successMessage = 'Your request was sent successfully';
        }, error => {
            this.form.enable();
        });

    }

    get name(): AbstractControl {
        return this.form.get('name');
    }

    get email(): AbstractControl {
        return this.form.get('email');
    }

    get contactPerson(): AbstractControl {
        return this.form.get('contact_person');
    }

}
