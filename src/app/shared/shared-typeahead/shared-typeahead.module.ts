import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedTypeaheadComponent} from './shared-typeahead.component';
import {NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';


@NgModule({
    declarations: [SharedTypeaheadComponent],
    exports: [
        SharedTypeaheadComponent
    ],
    imports: [
        CommonModule,
        NgbTypeaheadModule,
        FormsModule
    ]
})
export class SharedTypeaheadModule {
}
