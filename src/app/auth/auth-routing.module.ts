import {Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from '@app/auth/register/register.component';
import {AuthGuardService} from '@app/core';
import {RegisterConfirmationComponent} from '@app/auth/register-confirmation/register-confirmation.component';
import {ForgotPasswordComponent} from '@app/auth/forgot-password/forgot-password.component';
import {ResetPasswordComponent} from '@app/auth/reset-password/reset-password.component';

export const AuthRoutes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [AuthGuardService],
        data: {
            withAuth: false,
            redirectToDashboard: true
        }
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [AuthGuardService],
        data: {
            withAuth: false,
            redirectToDashboard: true
        }
    },
    {
        path: 'register/confirmation/:token',
        component: RegisterConfirmationComponent,
        canActivate: [AuthGuardService],
        data: {
            withAuth: false,
        }
    },
    {
        path: 'forgot',
        component: ForgotPasswordComponent,
        canActivate: [AuthGuardService],
        data: {
            withAuth: false,
        }
    },
    {
        path: 'reset/:token',
        component: ResetPasswordComponent,
        canActivate: [AuthGuardService],
        data: {
            withAuth: false,
        }
    }
];
