import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Ship} from '@app/core/model/ship.model';
import ShipService from '@app/core/services/rest/ship.service';
import BaseComponentClass from '@app/core/class/BaseComponent.class';
import {UtilService} from '@app/core';
import CompanyService from '@app/core/services/rest/company.service';
import {objectToFormData} from 'object-to-formdata';
import {ShipConstants} from '@app/pages/ship/ship.const';
import {
    DateValidator,
    urlValidator,
} from '@app/shared/form/custom-validator.class';
import {ToastrService} from 'ngx-toastr';
import {CFG} from '@app/core/config';

@Component({
    selector: 'app-ship-dialog',
    templateUrl: './ship-dialog.component.html',
    styleUrls: ['./ship-dialog.component.scss'],
})
export class ShipDialogComponent extends BaseComponentClass implements OnInit {
    @Input() title: string;
    @Input() ship: Ship;

    form: FormGroup;
    editMode = false;
    companyOptions = [];

    constructor(
        public activeModal: NgbActiveModal,
        private shipService: ShipService,
        private formBuilder: FormBuilder,
        private utilService: UtilService,
        public companyService: CompanyService,
        private toastrService: ToastrService
    ) {
        super();
    }

    ngOnInit(): void {
        this.editMode = !this.utilService.isEmptyOrNullObject(this.ship);
        this.initForm();
        this.patchForm();
    }

    onSubmit() {
        if (!this.form.valid) {
            return this.form.markAllAsTouched();
        }

        const body = this.prepareBody();
        const method = this.editMode
            ? this.shipService.updateShip(this.ship.id, body)
            : this.shipService.createShip(body);

        this.form.disable();

        this.subscriptions.sink = method.subscribe(
            (result: any) => {
                this.activeModal.close({ship: result});
                this.toastrService.success(
                    this.editMode
                        ? ShipConstants.msgSuccessUpdate
                        : ShipConstants.msgSuccessAdd
                );
            },
            (err) => {
                this.form.enable();
                this.toastrService.error(CFG.error.E000);
            }
        );
    }

    private initForm() {
        this.form = this.formBuilder.group({
            name: ['', {validators: [Validators.required], updateOn: 'blur'}],
            company_id: [null, {validators: [Validators.required], updateOn: 'blur'}],
            type: ['', {validators: [Validators.required], updateOn: 'blur'}],
            eu_number: ['', {validators: [Validators.required], updateOn: 'blur'}],
            build_year: ['', {validators: [Validators.required, Validators.pattern(/^\d{4}$/)], updateOn: 'blur'}],
            construction_site: ['', {validators: [Validators.required], updateOn: 'blur'}],
            nationality: ['', {validators: [Validators.required], updateOn: 'blur'}],
            image: [null, {validators: [Validators.required]}],
        });
    }

    private patchForm() {
        if (!this.editMode) {
            return;
        }
        const patchValue: any = Object.assign({}, this.ship);
        const company = patchValue.company;
        this.companyOptions.push({id: company.id, name: company.name});
        patchValue.company_id = Number(patchValue.company_id);
        patchValue.image = patchValue.image && [patchValue.image] || [];
        this.form.patchValue(patchValue);
    }

    private prepareBody() {
        const values = this.form.value;
        values.image = values.image[0];
        return objectToFormData(values);
    }
}
