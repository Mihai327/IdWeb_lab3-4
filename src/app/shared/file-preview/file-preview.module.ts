import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FilePreviewComponent} from '@app/shared/file-preview/file-preview.component';


@NgModule({
    declarations: [FilePreviewComponent],
    exports: [FilePreviewComponent],
    imports: [
        CommonModule
    ]
})
export class FilePreviewModule {
}
