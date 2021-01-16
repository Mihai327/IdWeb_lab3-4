import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {InlineModalComponent} from '@app/shared/inline-modal/inline-modal.component';

@NgModule({
    imports: [CommonModule, NgbModalModule],
    declarations: [InlineModalComponent],
    entryComponents: [InlineModalComponent],
    exports: [InlineModalComponent]
})
export class InlineModalModule {
}
