import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileExplorerComponent } from './file-explorer/file-explorer.component';
import {RouterModule} from '@angular/router';
import {FileManagerRoutes} from '@app/pages/file-manager/file-manager.routes';
import {TableModule} from '@app/shared/table/table.module';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';
import {SharedFormModule} from '@app/shared/form/shared-form.module';
import {PipesModule} from '@app/core/pipes/pipes.module';

@NgModule({
  declarations: [FileExplorerComponent, FileUploaderComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(FileManagerRoutes),
        TableModule,
        SharedFormModule,
        PipesModule,
    ]
})
export class FileManagerModule { }
