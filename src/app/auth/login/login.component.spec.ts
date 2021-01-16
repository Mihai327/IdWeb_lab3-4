import { HttpClientModule } from '@angular/common/http';
import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiService, TokenService, UtilService } from '@app/core';
import { AuthService } from '@app/core/auth/auth.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

import {LoginComponent} from './login.component';

class MockAuthService extends AuthService {
    isAuthenticated() {
        return true;
    }
}

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authService: AuthService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LoginComponent],
            imports: [HttpClientModule, 
                RouterTestingModule, 
                ToastrModule.forRoot()
            ],
            providers: [
                FormBuilder, 
                UtilService,  
                ToastrService, 
                ApiService, 
                AuthService, 
                TokenService]
        })
            .compileComponents();
        
        TestBed.overrideComponent(LoginComponent, {
            set: {providers: [{provide: AuthService, useClass: MockAuthService}]}
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        authService = TestBed.get(AuthService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should check the service', () => {
        expect(authService instanceof AuthService).toBeTruthy();
    });

    it('should inject service using inject function and check its instance', inject([AuthService], authSvc => {
        expect(authSvc).toBeTruthy();
        expect(authSvc instanceof AuthService).toBeTruthy();
    }));

    it('should test injected service injected using component overriding', () => {
        const overRiddenService = fixture.debugElement.injector.get(AuthService);
        expect(overRiddenService instanceof MockAuthService).toBeTruthy();
    });
});
