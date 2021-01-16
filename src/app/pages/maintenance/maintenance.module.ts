import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from '@app/shared/table/table.module';
import { SharedFilterModule } from '@app/shared/filter/shared-filter.module';
import { SharedFormModule } from '@app/shared/form/shared-form.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationDialogModule } from '@app/shared/confirmation-dialog/confirmation-dialog.module';
import { ToastrService } from 'ngx-toastr';
import { MaintenanceRoutes } from './maintenance.routes';
import { MaintenanceListComponent } from './maintenance-list/maintenance-list.component';
import { MaintenanceDialogComponent } from './maintenance-dialog/maintenance-dialog.component';
import { SkeletonModule } from '@app/shared/skeleton/skeleton.module';
import { MaintenanceInspectionComponent } from './maintenance-inspection/maintenance-inspection.component';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { FilePreviewModule } from '@app/shared/file-preview/file-preview.module';
import { MaintenanceInspectionResolverService } from './maintenance-inspection/maintenance-inspection-resolver.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaintenanceStatusComponent } from './maintenance-inspection/maintenance-status/maintenance-status.component';
import { DocumentViewerModalModule } from '@app/shared/document-viewer-modal/document-viewer-modal.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(MaintenanceRoutes),
        TableModule,
        SharedFilterModule,
        SharedFormModule,
        FormsModule,
        ReactiveFormsModule,
        ConfirmationDialogModule,
        SkeletonModule,
        FileUploadModule,
        FilePreviewModule,
        NgbModule,
        DocumentViewerModalModule
    ],
    declarations: [
        MaintenanceListComponent,
        MaintenanceDialogComponent,
        MaintenanceInspectionComponent,
        MaintenanceStatusComponent,
    ],
    providers: [
        ToastrService,
        MaintenanceInspectionResolverService,
    ],
})
export class MaintenanceModule {}
