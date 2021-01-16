import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SkeletonTableComponent} from './skeleton-table/skeleton-table.component';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';

@NgModule({
    imports: [
        CommonModule,
        NgxSkeletonLoaderModule
    ],
    declarations: [
        SkeletonTableComponent
    ],
    exports: [
        SkeletonTableComponent
    ]
})
export class SkeletonModule {
}
