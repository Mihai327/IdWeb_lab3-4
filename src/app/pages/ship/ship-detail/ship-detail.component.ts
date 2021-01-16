import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import BaseComponentClass from '@app/core/class/BaseComponent.class';
import {ActivatedRoute} from '@angular/router';
import {environment} from '@env/environment';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DashboardModalComponent} from '@app/pages/dashboard/dashboard-modal/dashboard-modal.component';
import {DocumentViewerModalComponent} from '@app/shared/document-viewer-modal/document-viewer-modal.component';

@Component({
    selector: 'app-ship-detail',
    templateUrl: './ship-detail.component.html',
    styleUrls: ['./ship-detail.component.scss']
})
export class ShipDetailComponent extends BaseComponentClass implements OnInit {
    @ViewChild('modalProblemTpl', {static: true}) modalProblemTpl: TemplateRef<any>;
    @ViewChild('upcomingTemplate', {static: true}) upcomingTemplate: TemplateRef<any>;
    @ViewChild('modalMaintenanceTpl', {static: true}) modalMaintenanceTpl: TemplateRef<any>;
    ship: any;
    hasImages: false;
    sourceUrl = environment.sourceUrl;

    constructor(
        private route: ActivatedRoute,
        private modalService: NgbModal
    ) {
        super();
    }

    ngOnInit(): void {
        this.subscriptions.sink = this.route.data.subscribe((data) => {
            data.resp.documents = data.resp.documents.filter(file => file.type_id === 2);
            data.resp.documents.forEach(file => this.processFile(file));

            this.ship = data.resp;
        });
    }

    get shipImage(): string {
        return environment.sourceUrl + this.ship.image;
    }

    onOpenProblemModal(product: any) {
        const modalRef = this.modalService.open(DashboardModalComponent);
        modalRef.componentInstance.title = 'Probleem melden';
        modalRef.componentInstance.object = {ship: this.ship.name, product: product.name};
        modalRef.componentInstance.template = this.modalProblemTpl;
        modalRef.componentInstance.service = {};
        modalRef.componentInstance.placeholder = 'Beschrijf hier uw probleem...';
        modalRef.componentInstance.textButton = 'Probleem melden';
        modalRef.componentInstance.submitFunction = 'product';
        modalRef.componentInstance.submitBody = {product_id: product.id};

        modalRef.result
            .then((result) => {
                return true;
            })
            .catch(() => {
                return false;
            });
    }

    onOpenInplannenModal(product: any) {
        const modalRef = this.modalService.open(DashboardModalComponent);
        modalRef.componentInstance.title = 'Onderhaud inplannen';
        modalRef.componentInstance.object = {ship: this.ship.name, product: product.name};
        modalRef.componentInstance.template = this.modalMaintenanceTpl;
        modalRef.componentInstance.service = {};
        modalRef.componentInstance.placeholder = 'Eventuele opmerkingen of voorkeuren kunt u hier achterlaten...';
        modalRef.componentInstance.textButton = 'Ik wil graag dat mijn contactpersoon contact op zoekt';
        modalRef.componentInstance.submitFunction = 'maintenance';
        modalRef.componentInstance.submitBody = {product_id: product.id};

        modalRef.result
            .then((result) => {
                return true;
            })
            .catch(() => {
                return false;
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

    private processFile(file) {
        const splitFileName = file.name.split('/');
        file.fileUrl = this.sourceUrl + file.name;
        file.fileName = splitFileName[splitFileName.length - 1];
    }
}
