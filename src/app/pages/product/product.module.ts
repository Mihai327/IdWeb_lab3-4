import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProductDetailComponent} from './product-detail/product-detail.component';
import {ProductListComponent} from '@app/pages/product/product-list/product-list.component';
import {ProductDialogComponent} from '@app/pages/product/product-dialog/product-dialog.component';
import {TableModule} from '@app/shared/table/table.module';
import {SharedFilterModule} from '@app/shared/filter/shared-filter.module';
import {SkeletonModule} from '@app/shared/skeleton/skeleton.module';
import {SharedFormModule} from '@app/shared/form/shared-form.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {ProductDetailResolverService} from '@app/pages/product/product-detail/product-detail-resolver.service';
import {FilePreviewModule} from '@app/shared/file-preview/file-preview.module';

@NgModule({
    declarations: [
        ProductDetailComponent,
        ProductListComponent,
        ProductDialogComponent,
    ],
    imports: [
        CommonModule,
        TableModule,
        SharedFilterModule,
        SkeletonModule,
        SharedFormModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        FilePreviewModule,
    ],
    providers: [ProductDetailResolverService]
})
export class ProductModule {
}
