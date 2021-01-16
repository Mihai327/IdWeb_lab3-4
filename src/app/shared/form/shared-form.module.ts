import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormInputComponent} from '@app/shared/form/form-input/form-input.component';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {ReactiveFormsModule} from '@angular/forms';
import {FormFileComponent} from '@app/shared/form/form-file/form-file.component';
import {FileUploadModule} from '@iplab/ngx-file-upload';
import {PipesModule} from '@app/core/pipes/pipes.module';
import {FilePreviewModule} from '@app/shared/file-preview/file-preview.module';
import {FormSelectComponent} from '@app/shared/form/form-select/form-select.component';
import {FormDatepickerComponent} from '@app/shared/form/form-datepicker/form-datepicker.component';
import {FormTextareaComponent} from '@app/shared/form/form-textarea/form-textarea.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormTypeaheadComponent} from './form-typeahead/form-typeahead.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        CommonModule,
        NgbTooltipModule,
        ReactiveFormsModule,
        FileUploadModule,
        PipesModule,
        FilePreviewModule,
        NgSelectModule,
        NgbModule
    ],
    declarations: [
        FormInputComponent,
        FormFileComponent,
        FormSelectComponent,
        FormTypeaheadComponent,
        FormTextareaComponent,
        FormDatepickerComponent
    ],
    exports: [
        FormInputComponent,
        FormFileComponent,
        FormSelectComponent,
        FormTypeaheadComponent,
        FormTextareaComponent,
        FormDatepickerComponent
    ]
})
export class SharedFormModule {
}
