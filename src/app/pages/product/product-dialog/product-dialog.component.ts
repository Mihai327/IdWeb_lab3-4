import {
    Component,
    Input,
    OnInit
} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Product} from '@app/core/model/product.model';
import ShipService from '@app/core/services/rest/ship.service';
import BaseComponentClass from '@app/core/class/BaseComponent.class';
import {UtilService} from '@app/core';
import ProductService from '@app/core/services/rest/product.service';
import {
    categoryCrane,
    categorySpudPole,
    categoryOptions,
} from '@app/pages/product/product-dialog.const';
import {Ship} from '@app/core/model/ship.model';
import {ProductConstants} from '@app/pages/product/product.const';
import {ToastrService} from 'ngx-toastr';
import {CFG} from '@app/core/config';
import {objectToFormData} from 'object-to-formdata';

@Component({
    selector: 'app-product-dialog',
    templateUrl: './product-dialog.component.html',
    styleUrls: ['./product-dialog.component.scss'],
})
export class ProductDialogComponent extends BaseComponentClass
    implements OnInit {
    @Input() title: string;
    @Input() product: Product;
    @Input() forWhatShip: Ship;

    categoryOptions = categoryOptions;
    form: FormGroup;
    editMode = false;
    shipOptions = [];
    success = false;

    constructor(
        public activeModal: NgbActiveModal,
        public shipService: ShipService,
        private formBuilder: FormBuilder,
        private utilService: UtilService,
        private productService: ProductService,
        private toastrService: ToastrService
    ) {
        super();
    }

    ngOnInit(): void {
        this.editMode = !this.utilService.isEmptyOrNullObject(this.product);
        this.initForm();
        this.categoryChange();
        this.setShipOptions();
        this.patchForm();
    }

    onSubmit() {
        if (!this.form.valid) {
            return this.form.markAllAsTouched();
        }

        const body = this.prepareBody();
        const method = this.editMode
            ? this.productService.updateProduct(this.product.id, body)
            : this.productService.createProduct(body);

        this.form.disable();

        this.subscriptions.sink = method.subscribe(
            (result: any) => {
                this.success = result;
                this.activeModal.close({product: result});
                this.toastrService.success(
                    this.editMode
                        ? ProductConstants.msgSuccessUpdate
                        : ProductConstants.msgSuccessAdd
                );
            },
            (err) => {
                this.form.enable();
                this.toastrService.error(CFG.error.E000);
            }
        );
    }

    private initForm() {
        categoryCrane.enable({emitEvent: false});
        categorySpudPole.enable({emitEvent: false});

        this.form = this.formBuilder.group({
            name: ['', {validators: [Validators.required], updateOn: 'blur'}],
            ship_id: [null, {validators: [Validators.required], updateOn: 'blur'}],
            build_number: ['', {validators: [Validators.required], updateOn: 'blur'}],
            build_year: ['', {validators: [Validators.required, Validators.pattern(/^\d{4}$/)], updateOn: 'blur'}],
            category: ['', {validators: [Validators.required], updateOn: 'blur'}],
            type: ['', {validators: [Validators.required]}],
            image: [null, {validators: [Validators.required]}]
        });
    }

    private categoryChange() {
        this.form.get('category').valueChanges.subscribe((value) => {
            const extraForm = value === '1' ? categoryCrane : categorySpudPole;
            extraForm.reset();
            this.form.setControl('details', extraForm);
        });
    }

    private patchForm() {
        if (!this.editMode) {
            return;
        }

        const patchValue: any = Object.assign({}, this.product);
        patchValue.details = patchValue;
        patchValue.image = patchValue.image && [patchValue.image] || [];
        this.form.patchValue(patchValue);
    }

    private setShipOptions() {
        if (this.editMode) {
            const product = this.product;
            this.shipOptions.push({id: product.ship_id, name: product.ship.name});
        } else if (this.forWhatShip) {
            this.shipOptions.push({
                id: this.forWhatShip.id,
                name: this.forWhatShip.name,
            });
            this.form.get('ship_id').setValue(this.forWhatShip.id);
        }
    }

    private prepareBody() {
        const value = this.form.value;
        const body = {...value, ...value.details};
        delete body['details'];
        body.image = value.image[0];
        return objectToFormData(body);
    }

    get category() {
        return this.form.get('category').value;
    }
}
