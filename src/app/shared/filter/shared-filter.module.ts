import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {FilterComponent} from '@app/shared/filter/filter.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [FilterComponent],
    exports: [FilterComponent],
    imports: [CommonModule, NgSelectModule, FormsModule, NgbModule],
})
export class SharedFilterModule {
}
