import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import BaseComponentClass from '@app/core/class/BaseComponent.class';
import {ActivatedRoute} from '@angular/router';
import {environment} from '@env/environment';
import {of} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DocumentViewerModalComponent} from '@app/shared/document-viewer-modal/document-viewer-modal.component';

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent
    extends BaseComponentClass
    implements OnInit {
    @ViewChild('actionTemplate', {static: true}) actionTemplate: TemplateRef<any>;
    @ViewChild('nameTemplate', {static: true}) nameTemplate: TemplateRef<any>;
    @ViewChild('statusTemplate', {static: true}) statusTemplate: TemplateRef<any>;
    @ViewChild('dateTemplate', {static: true}) dateTemplate: TemplateRef<any>;
    @ViewChild('linkTpl', {static: true}) linkTpl: TemplateRef<any>;

    product: any;
    isLoadingMaintenance = true;
    images = [];
    manuals = [];
    documents = [];
    maintenances = [];
    columnsMaintenance = [];
    asyncMaintenance;
    sourceUrl = environment.sourceUrl;

    constructor(
        private route: ActivatedRoute,
        private modalService: NgbModal
    ) {
        super();
    }

    ngOnInit(): void {
        this.subscriptions.sink = this.route.data.subscribe((data) => {
            this.product = data.resp;
            this.maintenances = this.product.maintenances;

            this.buildColumns();
            this.loadFiles();
            this.loadMaintenances();
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

    get productImage(): string {
        return environment.sourceUrl + this.product.image;

    }

    private loadFiles() {
        this.product.documents.forEach((doc) => {
            const splitFileName = doc.name.split('/');
            doc['fileUrl'] = environment.sourceUrl + doc.name;
            doc['fileName'] = splitFileName[splitFileName.length - 1];

            switch (doc.type_id) {
                case 1:
                    this.manuals.push(doc);
                    break;
                case 2:
                    this.images.push(doc);
                    break;
                case 3:
                    this.documents.push(doc);
                    break;
            }
        });
    }

    private loadMaintenances() {
        this.asyncMaintenance = of(this.maintenances);
        this.isLoadingMaintenance = false;
    }

    private buildColumns() {
        this.columnsMaintenance = [
            {Name: 'Datum', Prop: 'date', cellTemplate: this.dateTemplate},
            {Name: 'Categorie', Prop: 'category.name'},
            {
                Name: 'Uitvoering',
                Prop: 'inspector',
                cellTemplate: this.nameTemplate,
            },
            {
                Name: 'Status',
                Prop: 'status',
                cellTemplate: this.statusTemplate,
            },
            {
                Name: 'Acties',
                Prop: 'id',
                cellTemplate: this.actionTemplate,
                routerLink: '/maintenance/inspect',
                label: 'Bekijken',
            },
        ];
    }
}
