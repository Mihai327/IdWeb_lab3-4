import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from '@app/shared/table/table.module';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import {DashboardModalModule} from '@app/pages/dashboard/dashboard-modal/dashboard-modal.module';
import {SkeletonModule} from '@app/shared/skeleton/skeleton.module';

@NgModule({
    imports: [
        CommonModule,
        TableModule,
        RouterModule,
        DashboardModalModule,
        SkeletonModule
    ],
    declarations: [DashboardComponent],
})
export class DashboardModule {}
