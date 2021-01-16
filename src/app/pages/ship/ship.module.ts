import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ShipListComponent} from '../ship/ship-list/ship-list.component';
import {ShipDialogComponent} from '../ship/ship-dialog/ship-dialog.component';
import {ShipDetailResolverService} from '@app/pages/ship/ship-detail/ship-detail-resolver.service';
import {TableModule} from '@app/shared/table/table.module';
import {SharedFilterModule} from '@app/shared/filter/shared-filter.module';
import {SkeletonModule} from '@app/shared/skeleton/skeleton.module';
import {RouterModule} from '@angular/router';
import {SharedFormModule} from '@app/shared/form/shared-form.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DashboardModalModule} from '@app/pages/dashboard/dashboard-modal/dashboard-modal.module';

@NgModule({
    declarations: [
        ShipListComponent,
        ShipDialogComponent
    ],
    imports: [
        CommonModule,
        TableModule,
        SharedFilterModule,
        SkeletonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        SharedFormModule,
        DashboardModalModule
    ],
    providers: [
        ShipDetailResolverService
    ]
})
export class ShipModule {
}
