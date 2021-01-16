import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';

import {NgbDateParserFormatter, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ChartsModule} from 'ng2-charts';
import {NgCircleProgressModule} from 'ng-circle-progress';
import {DragulaModule} from 'ng2-dragula';
import {NgxGaugeModule} from 'ngx-gauge';

import {NgProgressModule} from 'ngx-progressbar';

import {NgProgressHttpModule} from 'ngx-progressbar/http';

import {AppComponent} from './app.component';

import {Page404Component} from './sample-pages/page404/page404.component';
import {Page500Component} from './sample-pages/page500/page500.component';
import {LayoutModule} from '@app/layout/layout.module';
import {AuthModule} from '@app/auth/auth.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import {NgbDateNlParserFormatter} from '@app/shared/form/ngb-date-nl-parser-formatter';
import { DashboardModule } from '@app/pages/dashboard/dashboard.module';

@NgModule({
    declarations: [
        AppComponent,
        Page404Component,
        Page500Component,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule,
        AppRoutingModule,
        FormsModule,
        ChartsModule,
        NgProgressModule,
        NgProgressHttpModule,
        NgxGaugeModule,
        NgbModule,
        DragulaModule.forRoot(),
        ToastrModule.forRoot({
            timeOut: 5000,
            positionClass: 'toast-top-center',
            preventDuplicates: true,
        }),
        NgCircleProgressModule.forRoot({
            radius: 60,
            outerStrokeWidth: 10,
            innerStrokeWidth: 5,
            showBackground: false,
            startFromZero: false
        }),
        LayoutModule,
        AuthModule,
        DashboardModule
    ],
    providers: [
        {provide: NgbDateParserFormatter, useClass: NgbDateNlParserFormatter}
    ],
    exports: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
