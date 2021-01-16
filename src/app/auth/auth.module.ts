import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login/login.component';
import {AuthRoutes} from '@app/auth/auth-routing.module';
import {RouterModule} from '@angular/router';
import {CoreModule} from '@app/core/core.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RegisterComponent} from '@app/auth/register/register.component';
import {RegisterConfirmationComponent} from './register-confirmation/register-confirmation.component';
import {LoaderModule} from '@app/shared/loader/loader.module';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';

@NgModule({
    declarations: [
        LoginComponent,
        RegisterComponent,
        RegisterConfirmationComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent
    ],
    imports: [
        CommonModule,
        CoreModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(AuthRoutes),
        LoaderModule,
    ]
})
export class AuthModule {
}
