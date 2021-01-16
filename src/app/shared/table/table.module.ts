import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxPaginationModule} from 'ngx-pagination';
import {TableAsyncComponent} from '@app/shared/table/table-async.component';
import {SkeletonModule} from '@app/shared/skeleton/skeleton.module';

@NgModule({
    declarations: [
        TableAsyncComponent,
    ],
    exports: [
        TableAsyncComponent
    ],
    imports: [
        CommonModule,
        NgbPaginationModule,
        NgxPaginationModule,
        SkeletonModule
    ]
})
export class TableModule {
}
