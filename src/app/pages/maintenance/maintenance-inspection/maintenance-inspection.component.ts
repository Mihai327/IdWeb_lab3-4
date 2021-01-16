import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {
    FileUploadControl,
} from '@iplab/ngx-file-upload';
import BaseComponentClass from '@app/core/class/BaseComponent.class';
import {ActivatedRoute} from '@angular/router';
import {Maintenance} from '@app/core/model/maintenance.model';
import {MaintenanceDialogComponent} from '@app/pages/maintenance/maintenance-dialog/maintenance-dialog.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MaintenanceConstants} from '@app/pages/maintenance/maintenance.const';
import {MaintenanceService} from '@app/core/services/rest/maintenance.service';
import {ConfirmationDialogComponent} from '@app/shared/confirmation-dialog/confirmation-dialog.component';
import {ToastrService} from 'ngx-toastr';
import {forkJoin} from 'rxjs';
import {objectToFormData} from 'object-to-formdata';
import {PermissionsService} from '@app/core/services/permissions.service';
import {DocumentViewerModalComponent} from '@app/shared/document-viewer-modal/document-viewer-modal.component';
import {saveAs} from 'file-saver';
import DocumentService from '@app/core/services/rest/document.service';
import {DeleteStatuses} from '@app/core';
import MaintenanceCommentService from '@app/core/services/rest/maintenance-comment.service';
import {environment} from '@env/environment';

@Component({
    selector: 'app-maintenance-inspection',
    templateUrl: './maintenance-inspection.component.html',
    styleUrls: ['./maintenance-inspection.component.scss'],
})
export class MaintenanceInspectionComponent
    extends BaseComponentClass
    implements OnInit {
    @ViewChild('deleteDocumentTpl', {static: true})
    deleteDocumentTpl: TemplateRef<any>;
    @ViewChild('deleteAllDocumentTpl', {static: true})
    deleteAllDocumentTpl: TemplateRef<any>;
    @ViewChild('deleteImageTpl', {static: true}) deleteImageTpl: TemplateRef<any>;
    @ViewChild('deleteAllImageTpl', {static: true})
    deleteAllImageTpl: TemplateRef<any>;
    imageUploadControl = new FileUploadControl().setListVisibility(false);
    documentUploadControl = new FileUploadControl().setListVisibility(false);
    title = '';
    noteControl = '';

    showNotesForm = false;
    showImageForm = false;
    showDocumentForm = false;
    notes = [];
    maintenance: any = {};
    statusList = [];
    categoryOptions = [];
    isBeforeTheDate = false;
    isKlantUser = false;

    constructor(
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private maintenanceService: MaintenanceService,
        private toastrService: ToastrService,
        private permissionsService: PermissionsService,
        private documentService: DocumentService,
        private maintenanceCommentService: MaintenanceCommentService
    ) {
        super();
        this.isKlantUser = permissionsService.isKlantUser();
    }

    ngOnInit(): void {
        this.loadMaintenanceForm();
        this.subscriptions.sink = this.route.data.subscribe((data) => {
            this.maintenance = data.resp;
            this.title = `${this.maintenance.product.name} - ${this.maintenance.category.name}`;
            this.isBeforeTheDate =
                new Date(this.maintenance.date) >= new Date() ? true : false;
            this.loadFiles();
        });
    }

    onAddDocument(files: File[]) {
        const accept = ['application/msword', 'application/pdf', 'text/plain'];
        this.addFile(files, this.documentUploadControl, accept, 3);
    }

    onAddImage(files: File[]) {
        const accept = ['image/png', 'image/jpeg', 'image/svg+xml'];
        this.addFile(files, this.imageUploadControl, accept, 2);
    }

    onAddNote() {
        if (this.noteControl.length === 0) {
            return;
        }

        const body = {content: this.noteControl, maintenance_id: this.maintenance.id};
        this.subscriptions.sink = this.maintenanceCommentService.createComment(body).subscribe(data => {
            this.noteControl = '';
            this.showNotesForm = false;
            this.maintenance.comments = [data, ...this.maintenance.comments];
        });
    }

    onChangeStatus(status) {
        this.maintenance.status = status;
        this.updateMaintenanceItem('status');
    }

    onUpdateMaintenance(maintenance: Maintenance) {
        this.openMaintenanceDialog(
            MaintenanceConstants.editItemDialogTitle,
            maintenance
        );
    }

    onDeleteFile(file: any, all = false) {
        file.title = this.title;
        file.deleted = DeleteStatuses.PADDING;
    }

    onCancelImagesAction() {
        this.imageUploadControl.value.forEach((file: any) => file.deleted = DeleteStatuses.UNPROCCESSED);
        this.showImageForm = false;
    }

    onCancelDocumentsAction() {
        this.documentUploadControl.value.forEach((file: any) => file.deleted = DeleteStatuses.UNPROCCESSED);
        this.showDocumentForm = false;
    }

    onDeleteFiles(type: string) {
        const [files, template] = this.prepareDataForDeleteModal(type);

        if (files.length === 0) {
            type === 'images' ? this.showImageForm = false : this.showDocumentForm = false;
            return;
        }

        const modalRef = this.modalService.open(ConfirmationDialogComponent);
        modalRef.componentInstance.title = MaintenanceConstants.deleteImageTitle;
        modalRef.componentInstance.row = files.length > 1 ? files : files[0];
        modalRef.componentInstance.template = template;

        modalRef.result
            .then((result) => {
                if (result) {
                    const control = type === 'images' ? this.imageUploadControl : this.documentUploadControl;
                    this.deleteFiles(
                        files,
                        type === 'images' ? this.imageUploadControl : this.documentUploadControl,
                        type === 'images' ? 2 : 3);
                }
            })
            .catch(() => {
                if (type === 'images') {
                    this.imageUploadControl.valueChanges.value.filter((file: any) => file.deleted === DeleteStatuses.UNPROCCESSED);
                } else {
                    this.documentUploadControl.valueChanges.value.filter((file: any) =>
                        file.deleted === DeleteStatuses.UNPROCCESSED);
                }
            });
    }

    loadMaintenanceForm() {
        this.subscriptions.sink = this.maintenanceService
            .getMaintenanceForm()
            .subscribe((data: any) => {
                this.statusList = data.statuses;
                this.categoryOptions = data.categories;
            });
    }

    onOpenDocument(file: any, type: string) {
        const modalRef = this.modalService.open(DocumentViewerModalComponent, {windowClass: 'document-viewer'});
        modalRef.componentInstance.file = file;
        modalRef.componentInstance.type = type;

        modalRef.result
            .then((result) => true)
            .catch(() => false);
    }

    onSaveFile(file: any) {
        this.documentService.getDocument({file: file.name}).subscribe((data: Blob) => {
            saveAs(data);
        });
    }

    private prepareDataForDeleteModal(type) {
        let files, template;
        if (type === 'images') {
            files = this.imageUploadControl.value.filter((file: any) => file.deleted === DeleteStatuses.PADDING);
            template = files.length > 1 ? this.deleteAllImageTpl : this.deleteImageTpl;
        } else {
            files = this.documentUploadControl.value.filter((file: any) => file.deleted === DeleteStatuses.PADDING);
            template = files.length > 1 ? this.deleteAllDocumentTpl : this.deleteDocumentTpl;
        }

        return [files, template];
    }

    private loadFiles() {
        this.maintenance.documents.forEach((doc) => {
            switch (doc.type_id) {
                case 2:
                    this.addToUploadControl(this.imageUploadControl, doc);
                    break;
                case 3:
                    this.addToUploadControl(this.documentUploadControl, doc);
                    break;
            }
        });
    }

    private openMaintenanceDialog(
        title: string,
        maintenance: Maintenance = null
    ) {
        const modalRef = this.modalService.open(MaintenanceDialogComponent, {
            windowClass: 'maintenance-dialog',
        });
        modalRef.componentInstance.title = title;
        modalRef.componentInstance.maintenance = Object.assign({}, maintenance);
        modalRef.componentInstance.categoryOptions = this.categoryOptions;
        modalRef.result
            .then((result) => {
                if (result) {
                    return true;
                }
            })
            .catch(() => {
                return false;
            });
    }

    private deleteFiles(files: any[], control: FileUploadControl, typeId: number) {
        const requests = [];
        files.forEach(file => {
            requests.push(this.maintenanceService.deleteFile(this.maintenance.id, file.id));
            control.removeFile(file);
        });

        forkJoin(requests).subscribe(resp => {
            this.toastrService.success(
                `You have successfully deleted ${
                    requests.length > 1
                        ? requests.length + (typeId === 2 ? ' images' : ' documents')
                        : (typeId === 2 ? '1 image' : '1 document')
                }`
            );

            typeId === 2 ? this.showImageForm = false : this.showDocumentForm = false;
        });
    }

    private updateMaintenanceItem(update: string) {
        const product = this.maintenance.product;
        const ship = product.ship;
        const company = ship.company;
        const inspector = this.maintenance.inspector;
        const contactPerson = this.maintenance.contact_person;
        const body = {
            company_id: company.id,
            ship_id: ship.id,
            product_id: product.id,
            work_type_id: this.maintenance.work_type.id,
            category_id: this.maintenance.category.id,
            date: this.maintenance.date,
            contact_person: contactPerson.id,
            inspector: inspector.id,
            note: this.maintenance.note,
            status_id: this.maintenance.status.id,
        };
        this.maintenanceService
            .updateMaintenance(this.maintenance.id, body)
            .subscribe((resp) => {
                this.toastrService.success(
                    'You have successfully updated ' + update
                );
            });
    }

    private addFile(
        files: File[],
        control: FileUploadControl,
        accept = [],
        typeId: number
    ) {
        const requests = [];
        files.forEach((file) => {
            const isAccept = accept.find((type) => file.type === type);
            if (isAccept && !file['added']) {
                const body = {
                    label: file.name,
                    description: file.name,
                    type_id: typeId,
                    file: file,
                };
                requests.push(
                    this.maintenanceService.createDocument(
                        this.maintenance.id,
                        objectToFormData(body)
                    )
                );
                control.removeFile(file);
            }
            if (!isAccept && !file['added']) {
                control.removeFile(file);
                this.toastrService.error('You cannot upload files of this type');
            }
        });
        forkJoin(requests).subscribe(
            (resp) => {
                resp.forEach((file: any) => {
                    this.addToUploadControl(control, file);
                });
                this.toastrService.success(
                    'You have successfully uploaded ' +
                    requests.length +
                    ((typeId === 2 && ' images') ||
                        (typeId === 3 && ' documents'))
                );
            },
            (err) => {
                files.forEach((file) => control.removeFile(file));
            }
        );
    }

    private addToUploadControl(control: FileUploadControl, file: any) {
        file['added'] = true;
        file['fileUrl'] = environment.sourceUrl + file.name;
        control.addFile(file);
    }
}
