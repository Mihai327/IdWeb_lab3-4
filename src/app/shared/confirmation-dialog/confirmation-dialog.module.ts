import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConfirmationDialogComponent} from '@app/shared/confirmation-dialog/confirmation-dialog.component';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';


@NgModule({
    imports: [
        CommonModule,
        NgbModalModule,
        FormsModule
    ],
    declarations: [
        ConfirmationDialogComponent
    ],
    entryComponents: [
        ConfirmationDialogComponent
    ]
})
export class ConfirmationDialogModule {
}
