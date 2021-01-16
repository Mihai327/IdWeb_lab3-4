import { HttpClientModule } from '@angular/common/http';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiService, AuthService, TokenService, UtilService } from '@app/core';
import { PermissionsService } from '@app/core/services/permissions.service';
import CompanyService from '@app/core/services/rest/company.service';
import UserService from '@app/core/services/rest/user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule, ToastrService } from 'ngx-toastr';

import {UserDialogComponent} from './user-dialog.component';

describe('UserDialogComponent', () => {
    let component: UserDialogComponent;
    let fixture: ComponentFixture<UserDialogComponent>;
    const formData = {
        first_name: 'TI',
        last_name: '181',
        email: 'testing@component.com',
        company_id: 1,
        type_id: 1,
        phone: '0123456788',
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UserDialogComponent],
            imports: [HttpClientModule, 
                RouterTestingModule, 
                ToastrModule.forRoot()
            ],
            providers: [NgbActiveModal, 
                CompanyService,
                UserService,
                FormBuilder, 
                UtilService, 
                PermissionsService, 
                ToastrService, 
                ApiService, 
                AuthService, 
                TokenService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserDialogComponent);
        component = fixture.componentInstance;
        component.formOptions = {userTypes: [1, 2]};
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('is form invalid when empty', () => {
        component.ngOnInit();
        const form = component.form;

        expect(form).not.toBeUndefined();

        expect(form.invalid).toBeTruthy();

        form.patchValue(formData);

        expect(form.valid).toBeTruthy();

        form.controls['email'].setValue(1234);

        expect(form.valid).toBeFalsy();
    });

    it('is the form disabled during the request', () => {
        component.ngOnInit();
        const form = component.form;

        expect(form).not.toBeUndefined();

        form.patchValue(formData);

        if (form.valid) {
            component.onSubmit();
            expect(form.disabled).toBeTruthy();
        } else {
            expect(form.disabled).toBeFalsy();
        }
    });
});
