import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {DocumentViewerModalComponent} from '@app/shared/document-viewer-modal/document-viewer-modal.component';

@NgModule({
    imports: [CommonModule, NgbModalModule],
    declarations: [DocumentViewerModalComponent],
    entryComponents: [DocumentViewerModalComponent],
    exports: [DocumentViewerModalComponent]
})
export class DocumentViewerModalModule {
}
