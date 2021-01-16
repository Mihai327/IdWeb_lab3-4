import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import DocumentService from '@app/core/services/rest/document.service';
import {map, tap} from 'rxjs/operators';
import {saveAs} from 'file-saver';
import {FormBuilder} from '@angular/forms';
import {environment} from '@env/environment';
import {DomSanitizer} from '@angular/platform-browser';
import BaseComponentClass from '@app/core/class/BaseComponent.class';
import {ActivatedRoute, Router} from '@angular/router';
import {PermissionsService} from '@app/core/services/permissions.service';
import {ConfirmationDialogComponent} from '@app/shared/confirmation-dialog/confirmation-dialog.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {FileManagerConstants} from '@app/pages/file-manager/file-manager.consts';

@Component({
    selector: 'app-file-explorer',
    templateUrl: './file-explorer.component.html',
    styleUrls: ['./file-explorer.component.scss']
})
export class FileExplorerComponent extends BaseComponentClass implements OnInit {
    @ViewChild('nameTpl', {static: true}) nameTpl: TemplateRef<any>;
    @ViewChild('dateTpl', {static: true}) dateTpl: TemplateRef<any>;
    @ViewChild('downloadTpl', {static: true}) downloadTpl: TemplateRef<any>;
    @ViewChild('modalBodyTpl', {static: true}) modalBodyTpl: TemplateRef<any>;

    columns: any[];
    isLoading = false;
    asyncFiles;
    levels: any[] = [{source: 'root', name: 'Bedrijven', source_id: null}];
    documentTypeSources = null;
    selectedFile = null;
    fileForm;
    sourceUrl = environment.sourceUrl;
    isAdmin = false;

    constructor(private documentService: DocumentService,
                private formBuilder: FormBuilder,
                private sanitizer: DomSanitizer,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private permissionsService: PermissionsService,
                private modalService: NgbModal,
                private toastrService: ToastrService) {
        super();
    }

    ngOnInit(): void {
        this.isAdmin = this.permissionsService.isAdminUser();
        this.buildColumns();
        this.initFileForm();

        this.subscriptions.sink = this.activatedRoute.queryParams.subscribe(params => {
            const source = params.source || 'root';
            const source_id = params.identifier || null;
            this.loadData(source, source_id);
        });
    }

    openSomething(fileEntity: any) {
        this.router.navigate(['file'], {
            queryParams: {
                source: fileEntity.source,
                identifier: fileEntity.source_id
            }
        });
    }

    onBreadcrumb(index: number) {
        if (index === this.levels.length - 1) {
            return;
        }

        this.selectedFile = null;
        this.openSomething(this.levels[index]);
    }

    onSelectDocumentType(documentType) {
        if (documentType.source_id === this.levels[this.levels.length - 1].source_id) {
            return true;
        }

        this.openSomething(documentType);
    }

    onSelectFile(file) {
        file.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.sourceUrl + file.url + file.name);
        this.selectedFile = file;
        this.fileForm.patchValue(file);
        this.levels.push({name: (file.label || file.name)});
    }

    onBack() {
        if (this.levels.length === 1) {
            return;
        }

        this.onBreadcrumb(this.levels.length - 2);
    }

    onSaveFile(file: any) {
        this.subscriptions.sink = this.documentService.getDocument({file: `${file.url}/${file.name}`}).subscribe((data: Blob) => {
            saveAs(data);
        });
    }

    onSubmitEdit() {
        if (!this.fileForm.valid) {
            return this.fileForm.markAllAsTouched();
        }

        const body = this.fileForm.value;
        this.subscriptions.sink = this.documentService.updateDocument(this.selectedFile.id, body)
            .subscribe(data => {
                this.selectedFile = Object.assign(this.selectedFile, body);
            });
    }

    onDeleteSelectedFile() {
        const modalRef = this.modalService.open(ConfirmationDialogComponent);
        modalRef.componentInstance.title = FileManagerConstants.deleteDialogTitle;
        modalRef.componentInstance.template = this.modalBodyTpl;

        modalRef.result.then((result) => {
            if (result) {
                this.deleteSelectedFile();
            }
        })
            .catch(() => {
                return false;
            });
    }

    private buildColumns() {
        this.columns = [
            {Name: 'Naam', Prop: 'name', cellTemplate: this.nameTpl},
            {Name: 'Beschrijving', Prop: 'description'},
            {Name: 'Geupload op', Prop: 'created_at', cellTemplate: this.dateTpl},
            {Name: '', Prop: 'created_at', cellTemplate: this.downloadTpl}
        ];
    }

    private initFileForm() {
        this.fileForm = this.formBuilder.group({
            label: [''],
            description: ['']
        });
    }

    private loadDocumentTypes() {
        const params = {level: this.levels[this.levels.length - 2].source, id: this.levels[this.levels.length - 2].source_id};
        this.subscriptions.sink = this.documentService.getSystem(params).subscribe(data => {
            this.documentTypeSources = data.files;
        });
    }

    private deleteSelectedFile() {
        this.subscriptions.sink = this.documentService.deleteDocument(this.selectedFile.id).subscribe(() => {
            this.toastrService.success(FileManagerConstants.deleteSuccess);
            this.onBack();
        });
    }

    private loadData(level: string, id = null) {
        this.isLoading = true;
        const params: any = {
            level,
            id,
        };

        this.asyncFiles = this.documentService
            .getSystem(params)
            .pipe(
                tap((res: any) => {
                    this.levels = res.sources;

                    if (level === 'product') {
                        this.documentTypeSources = res.files;
                    }

                    if (level === 'document' && !this.documentTypeSources) {
                        this.loadDocumentTypes();
                    }

                    this.isLoading = false;
                }),
                map(res => res.files)
            );
    }
}
