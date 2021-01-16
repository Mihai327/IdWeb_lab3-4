import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import BaseComponentClass from '@app/core/class/BaseComponent.class';
import {FilterField} from '@app/core/model/filter-field.model';
import {MaintenanceService} from '@app/core/services/rest/maintenance.service';
import {map, tap} from 'rxjs/operators';
import CompanyService from '@app/core/services/rest/company.service';
import ShipService from '@app/core/services/rest/ship.service';
import ProductService from '@app/core/services/rest/product.service';
import {MaintenanceConstants} from '@app/pages/maintenance/maintenance.const';
import {Maintenance} from '@app/core/model/maintenance.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MaintenanceDialogComponent} from '@app/pages/maintenance/maintenance-dialog/maintenance-dialog.component';
import {ConfirmationDialogComponent} from '@app/shared/confirmation-dialog/confirmation-dialog.component';
import {PermissionsService} from '@app/core/services/permissions.service';
import {ToastrService} from 'ngx-toastr';
import {CFG} from '@app/core';

@Component({
    selector: 'app-maintenance-list',
    templateUrl: './maintenance-list.component.html',
    styleUrls: ['./maintenance-list.component.scss'],
})
export class MaintenanceListComponent extends BaseComponentClass
    implements OnInit {
    @ViewChild('actionTemplate', {static: true}) actionTemplate: TemplateRef<any>;
    @ViewChild('nameTemplate', {static: true}) nameTemplate: TemplateRef<any>;
    @ViewChild('statusTemplate', {static: true}) statusTemplate: TemplateRef<any>;
    @ViewChild('modalBodyTpl', {static: true}) modalBodyTpl: TemplateRef<any>;
    @ViewChild('dateTemplate', {static: true}) dateTemplate: TemplateRef<any>;

    columns: any[];
    asyncMaintenance;
    isLoading = true;
    meta;
    filterFields: FilterField[] = [];
    statusFilterField: FilterField;
    categoryFilterField: FilterField;
    isKlantUser = false;
    isAdminUser = false;

    constructor(
        private modalService: NgbModal,
        private maintenanceService: MaintenanceService,
        private companyService: CompanyService,
        private shipService: ShipService,
        private productService: ProductService,
        private permissionsService: PermissionsService,
        private toastrService: ToastrService,
    ) {
        super();
        this.isKlantUser = permissionsService.isKlantUser();
        this.isAdminUser = permissionsService.isAdminUser();
    }

    ngOnInit(): void {
        this.buildColumns();
        this.buildFilterFields();
        this.loadMaintenanceForm();
        this.loadData(1);
    }

    pageChanged($event) {
        this.loadData($event);
    }

    private loadData(page, filterParams = {}) {
        this.isLoading = true;
        const params: any = {
            page,
            ...filterParams,
        };

        this.asyncMaintenance = this.maintenanceService
            .getMaintenances(params)
            .pipe(
                tap((res: any) => {
                    this.meta = res.meta;
                    this.isLoading = false;
                }),
                map((res: any) => res.data)
            );
    }


    onFilter(filterParams: any) {
        this.loadData(this.meta.current_page, filterParams);
    }

    onCreateMaintenance() {
        this.openMaintenanceDialog(MaintenanceConstants.newItemDialogTitle);
    }

    onUpdateMaintenance(maintenance: Maintenance) {
        this.openMaintenanceDialog(
            MaintenanceConstants.editItemDialogTitle,
            maintenance
        );
    }

    onInspectMaintenance(maintenance: Maintenance) {
        this.openMaintenanceDialog(
            MaintenanceConstants.inspectItemDialogTitle,
            maintenance,
            true
        );
    }

    onDeleteMaintenance(maintenance: Maintenance) {
        const modalRef = this.modalService.open(ConfirmationDialogComponent);
        modalRef.componentInstance.title = MaintenanceConstants.deleteDialogTitle;
        modalRef.componentInstance.row = maintenance;
        modalRef.componentInstance.template = this.modalBodyTpl;

        modalRef.result.then((result) => {
            if (result) {
                this.deleteMaintenance(maintenance.id);
            }
        });
    }

    private buildColumns() {
        this.columns = [
            {Name: 'Datum', Prop: 'date', cellTemplate: this.dateTemplate},
            {Name: 'Product', Prop: 'product.name'},
            {Name: 'Schip', Prop: 'product.ship.name'},
            {Name: 'Categorieën', Prop: 'category.name'},
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
            {Name: 'Acties', Prop: 'id', cellTemplate: this.actionTemplate},
        ];

        if (this.isAdminUser) {
            this.columns.splice(3, 0, {Name: 'Bedrijf', Prop: 'product.ship.company.name'});
        }

        if (this.isKlantUser) {
            this.columns.splice(4, 0, {Name: 'Contactpersoon', Prop: 'contact_person', cellTemplate: this.nameTemplate});
        }
    }

    private buildFilterFields() {
        this.filterFields = [
            new FilterField({
                key: 'typeahead',
                name: 'ship_id',
                placeholder: 'Schip',
                typeaheadMethod: 'getShips',
                cssClasses: ['bootstrap-theme'],
                typeaheadService: this.shipService,
                typeaheadMethodParams: {fields: 'id,name'}
            }),
            new FilterField({
                key: 'typeahead',
                name: 'product_id',
                placeholder: 'Product',
                typeaheadMethod: 'getProducts',
                cssClasses: ['bootstrap-theme'],
                typeaheadService: this.productService,
                typeaheadMethodParams: {fields: 'id,name'}
            }),
            new FilterField({
                key: 'select',
                name: 'year',
                bindLabel: 'year',
                bindValue: 'year',
                placeholder: 'Jaar',
                selectOptions: CFG.years,
                cssClasses: ['bootstrap-theme']
            }),
            this.statusFilterField = new FilterField({
                key: 'select',
                name: 'status_id',
                placeholder: 'Status',
                cssClasses: ['bootstrap-theme']
            }),
            this.categoryFilterField = new FilterField({
                key: 'select',
                name: 'category_id',
                placeholder: 'Categorieën',
                cssClasses: ['bootstrap-theme']
            }),
        ];
    }

    private loadMaintenanceForm() {
        this.subscriptions.sink = this.maintenanceService.getMaintenanceForm().subscribe((data: any) => {
            this.statusFilterField.selectOptions = data.statuses;
            this.categoryFilterField.selectOptions = data.categories;
        });
    }

    private openMaintenanceDialog(title: string, maintenance: Maintenance = null, inspectMode = false) {
        const modalRef = this.modalService.open(MaintenanceDialogComponent, {windowClass: 'maintenance-dialog'});
        modalRef.componentInstance.title = title;
        modalRef.componentInstance.maintenance = Object.assign({}, maintenance);
        modalRef.componentInstance.inspectMode = inspectMode;
        modalRef.componentInstance.categoryOptions = this.categoryFilterField.selectOptions;
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

    private deleteMaintenance(id: number) {
        this.subscriptions.sink = this.maintenanceService
            .deleteMaintenance(id)
            .subscribe((result: any) => {
                this.toastrService.success(MaintenanceConstants.msgSuccessDelete);
                this.pageChanged(this.meta.current_page);
            });
    }
}
