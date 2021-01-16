import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';

import ShipService from '@app/core/services/rest/ship.service';
import BaseComponentClass from '@app/core/class/BaseComponent.class';
import {Ship} from '@app/core/model/ship.model';
import {ShipConstants} from '@app/pages/ship/ship.const';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ShipDialogComponent} from '@app/pages/ship/ship-dialog/ship-dialog.component';
import {ConfirmationDialogComponent} from '@app/shared/confirmation-dialog/confirmation-dialog.component';
import {map, tap} from 'rxjs/operators';
import {FilterField} from '@app/core/model/filter-field.model';
import CompanyService from '@app/core/services/rest/company.service';
import {ProductDialogComponent} from '@app/pages/product/product-dialog/product-dialog.component';
import {ProductConstants} from '@app/pages/product/product.const';
import {InlineModalComponent} from '@app/shared/inline-modal/inline-modal.component';

@Component({
    selector: 'app-ship-list',
    templateUrl: './ship-list.component.html',
    styleUrls: ['./ship-list.component.scss'],
})
export class ShipListComponent extends BaseComponentClass implements OnInit {
    @ViewChild('actionTemplate', {static: true}) actionTemplate: TemplateRef<any>;
    @ViewChild('modalBodyTpl', {static: true}) modalBodyTpl: TemplateRef<any>;
    @ViewChild('inlineModalBodyTpl1', {static: true}) inlineModalBodyTpl1: TemplateRef<any>;
    @ViewChild('inlineModalBodyTpl2', {static: true}) inlineModalBodyTpl2: TemplateRef<any>;

    columns: any[];
    asyncShips;
    isLoading = true;
    meta;
    filterParams;
    filterFields: FilterField[] = [];

    constructor(
        private shipService: ShipService,
        private modalService: NgbModal,
        private companyService: CompanyService
    ) {
        super();
    }

    ngOnInit(): void {
        this.columns = [
            {Name: 'Schip', Prop: 'name'},
            {Name: 'Bedrijf', Prop: 'company.name'},
            {Name: 'Producten', Prop: 'products_count'},
            {Name: 'Acties', Prop: 'id', cellTemplate: this.actionTemplate},
        ];
        this.buildFilterFields();

        this.loadData(1);
    }

    pageChanged($event) {
        this.loadData($event);
    }

    private loadData(page) {
        this.isLoading = true;
        const params: any = {
            page,
            expand: 'productsCount,company',
            ...this.filterParams
        };

        this.asyncShips = this.shipService.getShips(params).pipe(
            tap((res: any) => {
                this.meta = res.meta;
                this.isLoading = false;
            }),
            map((res: any) => res.data)
        );
    }

    onFilter(params: any) {
        this.filterParams = params;
        this.loadData(this.meta.current_page);
    }

    onCreateShip() {
        this.openShipDialog(ShipConstants.newItemDialogTitle);
    }

    onUpdateShip(ship: Ship) {
        this.openShipDialog(ShipConstants.editItemDialogTitle, ship);
    }

    private openShipDialog(title: string, ship: Ship = null) {
        const modalRef = this.modalService.open(ShipDialogComponent);
        modalRef.componentInstance.title = title;
        modalRef.componentInstance.ship = Object.assign({}, ship);

        modalRef.result
            .then((result) => {
                if (result) {
                    this.pageChanged(this.meta.current_page);
                    const newShip = result.ship;
                    if (!ship && newShip) {
                        this.openInlineModal(
                            'Product toevoegen',
                            newShip,
                            this.inlineModalBodyTpl1
                        );
                    }
                }
            })
            .catch(() => {
                return false;
            });
    }

    onDeleteShip(ship: Ship) {
        const modalRef = this.modalService.open(ConfirmationDialogComponent);
        modalRef.componentInstance.title = ShipConstants.deleteDialogTitle;
        modalRef.componentInstance.row = ship;
        modalRef.componentInstance.template = this.modalBodyTpl;

        modalRef.result.then((result) => {
            if (result) {
                this.deleteShip(ship.id);
            }
        });
    }

    private deleteShip(id: number) {
        this.subscriptions.sink = this.shipService
            .deleteShip(id)
            .subscribe((result: any) => {
                this.pageChanged(this.meta.current_page);
            });
    }

    private buildFilterFields() {
        this.filterFields = [
            new FilterField({
                key: 'typeahead',
                name: 'company_id',
                placeholder: 'Bedrijven',
                cssClasses: ['bootstrap-theme'],
                typeaheadService: this.companyService,
                typeaheadMethodParams: {fields: 'id,name'}
            }),
            new FilterField({
                key: 'input',
                name: 'search',
                placeholder: 'Voer naam in'
            })
        ];
    }

    private openInlineModal(title: string, ship: Ship, modalBodyTpl: TemplateRef<any>) {
        const inlineModal = this.modalService.open(InlineModalComponent);
        inlineModal.componentInstance.params = {
            title: title,
            leftBtn: 'Terugkeren naar index',
            rightBtn: 'Product toevoegen',
            row: ship,
            template: modalBodyTpl,
        };
        inlineModal.result
            .then((result) => {
                if (result) {
                    this.openProductDialog(ship);
                }
            })
            .catch(() => {
                return false;
            });
    }

    private openProductDialog(ship: Ship) {
        const productModal = this.modalService.open(ProductDialogComponent, {
            windowClass: 'product-dialog',
        });

        productModal.componentInstance.title = ProductConstants.newItemDialogTitle;
        productModal.componentInstance.forWhatShip = ship;
        productModal.result
            .then((product) => {
                if (product) {
                    this.pageChanged(this.meta.current_page);
                    this.openInlineModal('Product toevoegen', ship, this.inlineModalBodyTpl2);
                }
            })
            .catch(() => {
                return false;
            });
    }
}
