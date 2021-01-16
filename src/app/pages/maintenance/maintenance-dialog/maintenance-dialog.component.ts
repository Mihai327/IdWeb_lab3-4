import {Component, OnInit, Input} from '@angular/core';
import {Maintenance} from '@app/core/model/maintenance.model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import ShipService from '@app/core/services/rest/ship.service';
import BaseComponentClass from '@app/core/class/BaseComponent.class';
import {UtilService} from '@app/core';
import ProductService from '@app/core/services/rest/product.service';
import {ToastrService} from 'ngx-toastr';
import {CFG} from '@app/core/config';
import CompanyService from '@app/core/services/rest/company.service';
import UserService from '@app/core/services/rest/user.service';
import WorkTypesService from '@app/core/services/rest/work-types.service';
import {MaintenanceService} from '@app/core/services/rest/maintenance.service';

@Component({
    selector: 'app-maintenance-dialog',
    templateUrl: './maintenance-dialog.component.html',
    styleUrls: ['./maintenance-dialog.component.scss'],
})
export class MaintenanceDialogComponent extends BaseComponentClass
    implements OnInit {
    @Input() title: string;
    @Input() maintenance: Maintenance;
    @Input() categoryOptions: [];

    form: FormGroup;
    editMode = false;

    companyOptions = [];
    shipOptions = [];
    productOptions = [];
    inspectorOptions = [];
    contactOptions = [];
    workTypeOptions = [];

    addTag = (tag) => tag;

    constructor(
        public activeModal: NgbActiveModal,
        public shipService: ShipService,
        public companyService: CompanyService,
        public productService: ProductService,
        public userService: UserService,
        public workTypesService: WorkTypesService,
        private formBuilder: FormBuilder,
        private utilService: UtilService,
        private toastrService: ToastrService,
        private maintenanceService: MaintenanceService
    ) {
        super();
    }

    ngOnInit(): void {
        this.loadCompanyOptions();

        this.editMode = !this.utilService.isEmptyOrNullObject(this.maintenance);
        this.initForm();
        this.patchForm();
    }

    private initForm() {
        this.form = this.formBuilder.group({
            company_id: [null],
            ship_id: [null],
            product_id: [
                null,
                {validators: [Validators.required], updateOn: 'blur'},
            ],
            work_type_id: [
                null,
                {validators: [Validators.required], updateOn: 'blur'},
            ],
            category_id: [
                null,
                {validators: [Validators.required], updateOn: 'blur'},
            ],
            date: [
                '',
                {
                    validators: [Validators.required],
                    updateOn: 'blur',
                },
            ],
            contact_person_id: [null],
            inspector_id: [null],
            note: [''],
        });
    }

    onSubmit() {
        if (!this.form.valid) {
            return this.form.markAllAsTouched();
        }

        const body = this.prepareBody();
        const method = this.editMode
            ? this.maintenanceService.updateMaintenance(this.maintenance.id, body)
            : this.maintenanceService.createMaintenance(body);

        this.form.disable();

        this.subscriptions.sink = method.subscribe(
            (result: any) => {
                this.activeModal.close({maintenance: result});
                // this.toastrService.success(
                //     this.editMode
                //         ? MaintenanceConstants.msgSuccessUpdate
                //         : MaintenanceConstants.msgSuccessAdd
                // );
            },
            (err) => {
                this.form.enable();
                this.toastrService.error(CFG.error.E000);
            }
        );
    }

    private patchForm() {
        if (!this.editMode) {
            return;
        }
        const patchValue: any = Object.assign({}, this.maintenance);
        const product = patchValue.product;
        const ship = product.ship;
        const company = ship.company;
        const inspector = patchValue.inspector;
        const contactPerson = patchValue.contact_person;

        this.loadShipOptions(patchValue.company_id = company.id);
        this.loadProductoptions(patchValue.ship_id = ship.id);
        patchValue.product_id = product.id;
        patchValue.category_id = patchValue.category.id;
        patchValue.date = this.utilService.formattedDateToObject(patchValue.date);
        this.inspectorOptions = inspector ? [{
            id: patchValue.inspector_id = inspector.id,
            name: `${inspector.first_name} ${inspector.last_name}`
        }] : [];
        this.workTypeOptions = [patchValue.work_type];
        this.contactOptions = contactPerson ? [{
            id: patchValue.contact_person_id = contactPerson.id,
            name: `${contactPerson.first_name} ${contactPerson.last_name}`
        }] : [];
        patchValue.work_type_id = patchValue.work_type.id;

        this.form.patchValue(patchValue);
    }

    private prepareBody() {
        const values = this.form.value;
        values.date = this.utilService.getFormattedDate(values.date);

        return values;
    }

    private loadCompanyOptions() {
        const params = {fields: 'id,name'};
        this.subscriptions.sink = this.companyService.getCompanies(params).subscribe((resp: any) => {
            this.companyOptions = resp.data;
        });
    }

    private loadShipOptions(company_id?) {
        const params: any = {fields: 'id,name'};
        if (company_id) {
            params.company_id = company_id;
        }
        this.subscriptions.sink = this.shipService.getShips(params).subscribe((resp: any) => {
            this.shipOptions = resp.data;
        });
    }

    private loadProductoptions(ship_id?) {
        const params: any = {fields: 'id,name'};
        if (ship_id) {
            params.ship_id = ship_id;
        }
        this.subscriptions.sink = this.productService.getProducts(params).subscribe((resp: any) => {
            this.productOptions = resp.data;
        });
    }

    onChangeCompany(company) {
        this.shipOptions = [];
        this.productOptions = [];
        this.form.get('ship_id').reset();
        this.form.get('product_id').reset();
        if (company) {
            this.loadShipOptions(company.id);
        }
    }

    onChangeShip(ship) {
        this.productOptions = [];
        this.form.get('product_id').reset();
        if (ship) {
            this.loadProductoptions(ship.id);
        }
    }
}
