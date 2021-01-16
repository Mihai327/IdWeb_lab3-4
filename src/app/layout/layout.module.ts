import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LayoutComponent} from '@app/layout/layout.component';
import {NavbarComponent} from '@app/layout/partials/navbar/navbar.component';
import {FooterComponent} from '@app/layout/partials/footer/footer.component';
import {RouterModule} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DashboardModalModule} from '@app/pages/dashboard/dashboard-modal/dashboard-modal.module';

@NgModule({
    declarations: [
        LayoutComponent,
        NavbarComponent,
        FooterComponent
    ],
    exports: [
        NavbarComponent,
        FooterComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        NgbModule,
        DashboardModalModule
    ]
})
export class LayoutModule {
}
