import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {CompanyComponent} from '@app/shared/company/company.component';

@NgModule({
    declarations: [CompanyComponent],
    exports: [CompanyComponent],
    imports: [CommonModule, NgSelectModule, FormsModule],
})
export class SharedCompanyModule {
}
