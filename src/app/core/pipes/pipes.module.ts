import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImageFilePipe} from '@app/core/pipes/image-file.pipe';
import {SizePipe} from '@app/core/pipes/size.pipe';

@NgModule({
    declarations: [
        ImageFilePipe,
        SizePipe
    ],
    exports: [
        ImageFilePipe,
        SizePipe
    ],
    imports: [CommonModule],
})
export class PipesModule {
}
