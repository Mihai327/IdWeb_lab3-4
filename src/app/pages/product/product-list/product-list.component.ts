import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';

import ProductService from '@app/core/services/rest/product.service';
import BaseComponentClass from '@app/core/class/BaseComponent.class';
import {ProductConstants} from '@app/pages/product/product.const';
import {ProductDialogComponent} from '../product-dialog/product-dialog.component';
import {Product} from '@app/core/model/product.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {map, tap} from 'rxjs/operators';
import {ConfirmationDialogComponent} from '@app/shared/confirmation-dialog/confirmation-dialog.component';
import {ToastrService} from 'ngx-toastr';
import {CFG} from '@app/core/config';
import {FilterField} from '@app/core/model/filter-field.model';
import {categoryOptions} from '../product-dialog.const';
import CompanyService from '@app/core/services/rest/company.service';
import ShipService from '@app/core/services/rest/ship.service';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent extends BaseComponentClass implements OnInit {
    @ViewChild('actionTemplate', {static: true}) actionTemplate: TemplateRef<any>;
    @ViewChild('modalBodyTpl', {static: true}) modalBodyTpl: TemplateRef<any>;
    @ViewChild('categoryTpl', {static: true}) categoryTpl: TemplateRef<any>;

    columns: any[];
    asyncProducts;
    isLoading = true;
    meta;
    filterParams;
    filterFields: FilterField[] = [];

    constructor(
        private productService: ProductService,
        private modalService: NgbModal,
        private toastrService: ToastrService,
        private companyService: CompanyService,
        private shipService: ShipService
    ) {
        super();
    }

    ngOnInit(): void {
        this.columns = [
            {Name: 'S/N', Prop: 'build_number'},
            {Name: 'Product', Prop: 'name'},
            {Name: 'Schip', Prop: 'ship.name'},
            {Name: 'Bedrijf', Prop: 'ship.company.name'},
            {Name: 'Categorieën', Prop: 'category', cellTemplate: this.categoryTpl},
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
            expand: 'ship.company',
            ...this.filterParams
        };

        this.asyncProducts = this.productService.getProducts(params).pipe(
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

    onCreateProduct() {
        this.openProductDialog(ProductConstants.newItemDialogTitle);
    }

    onUpdateProduct(product: Product) {
        this.openProductDialog(ProductConstants.editItemDialogTitle, product);
    }

    private openProductDialog(title: string, product: Product = null) {
        const modalRef = this.modalService.open(ProductDialogComponent, {windowClass: 'product-dialog'});
        modalRef.componentInstance.title = title;
        modalRef.componentInstance.product = Object.assign({}, product);

        modalRef.result
            .then((result) => {
                if (result) {
                    this.pageChanged(this.meta.current_page);
                }
            })
            .catch(() => {
                return false;
            });
    }

    onDeleteProduct(product: Product) {
        const modalRef = this.modalService.open(ConfirmationDialogComponent);
        modalRef.componentInstance.title = ProductConstants.deleteDialogTitle;
        modalRef.componentInstance.row = product;
        modalRef.componentInstance.template = this.modalBodyTpl;
        modalRef.componentInstance.withForm = true;

        modalRef.result.then((result) => {
            if (result) {
                this.deleteProduct(product.id);
            }
        });
    }

    private deleteProduct(id: number) {
        this.subscriptions.sink = this.productService
            .deleteProduct(id)
            .subscribe((result: any) => {
                    this.pageChanged(this.meta.current_page);
                    this.toastrService.success('You have successfully deleted 1 product');
                },
                err => {
                    this.toastrService.error(CFG.error.E000);
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
                key: 'typeahead',
                name: 'ship_id',
                placeholder: 'Schepen',
                typeaheadMethod: 'getShips',
                cssClasses: ['bootstrap-theme'],
                typeaheadService: this.shipService,
                typeaheadMethodParams: {fields: 'id,name'}
            }),
            new FilterField({
                key: 'select',
                name: 'category',
                placeholder: 'Categorieën',
                selectOptions: categoryOptions,
                cssClasses: ['bootstrap-theme']
            }),
            new FilterField({
                key: 'input',
                name: 'search',
                placeholder: 'Voer s/n nummer of productnaam in'
            })
        ];
    }
}
