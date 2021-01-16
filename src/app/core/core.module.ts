import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {TokenInterceptor} from './interceptor';
import {AuthGuardService, AuthService, TokenService} from './auth';
import {ApiService, UtilService} from './services';
import {WINDOW, windowFactory} from './window-factory';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        HttpClientModule
    ],
    providers: [
        ApiService,
        AuthService,
        AuthGuardService,
        TokenService,
        UtilService,
        {provide: WINDOW, useFactory: windowFactory},
        {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}
    ]
})
export class CoreModule {
}
