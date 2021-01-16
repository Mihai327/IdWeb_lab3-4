import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardModalComponent} from '@app/pages/dashboard/dashboard-modal/dashboard-modal.component';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';


@NgModule({
    imports: [
        CommonModule,
        NgbModalModule,
        FormsModule
    ],
    declarations: [
        DashboardModalComponent
    ],
    entryComponents: [
        DashboardModalComponent
    ]
})
export class DashboardModalModule {
}
