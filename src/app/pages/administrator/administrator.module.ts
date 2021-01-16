import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdministratorComponent} from './administrator.component';
import {CompanyListComponent} from './company/company-list/company-list.component';
import {RouterModule} from '@angular/router';
import {AdministratorRoutes} from '@app/pages/administrator/administrator.routes';
import {UserListComponent} from './user/user-list/user-list.component';
import {NgbNavModule, NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap';
import {TableModule} from '@app/shared/table/table.module';
import {SkeletonModule} from '@app/shared/skeleton/skeleton.module';
import {CompanyDialogComponent} from './company/company-dialog/company-dialog.component';
import {SharedFormModule} from '@app/shared/form/shared-form.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ConfirmationDialogModule} from '@app/shared/confirmation-dialog/confirmation-dialog.module';
import {UserDialogComponent} from './user/user-dialog/user-dialog.component';
import {SharedTypeaheadModule} from '@app/shared/shared-typeahead/shared-typeahead.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {SharedCompanyModule} from '@app/shared/company/shared-company.module';
import {InlineModalModule} from '@app/shared/inline-modal/inline-modal.module';
import {ToastrService} from 'ngx-toastr';
import {SharedFilterModule} from '@app/shared/filter/shared-filter.module';
import { ShipDetailComponent } from '../ship/ship-detail/ship-detail.component';
import {ShipModule} from '@app/pages/ship/ship.module';
import {ProductModule} from '@app/pages/product/product.module';

@NgModule({
    imports: [
        CommonModule,
        NgbNavModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(AdministratorRoutes),
        SharedFormModule,
        ConfirmationDialogModule,
        SkeletonModule,
        TableModule,
        NgbTypeaheadModule,
        SharedTypeaheadModule,
        NgSelectModule,
        SharedCompanyModule,
        InlineModalModule,
        SharedFilterModule,
        ShipModule,
        ProductModule
    ],
    declarations: [
        AdministratorComponent,
        CompanyListComponent,
        UserListComponent,
        CompanyDialogComponent,
        UserDialogComponent,
        ShipDetailComponent
    ],
    entryComponents: [
        CompanyDialogComponent,
        UserDialogComponent
    ],
    providers: [ToastrService]
})
export class AdministratorModule {
}
