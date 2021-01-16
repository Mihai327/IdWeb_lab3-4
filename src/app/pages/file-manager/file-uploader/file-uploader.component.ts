import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import BaseComponentClass from '@app/core/class/BaseComponent.class';
import CompanyService from '@app/core/services/rest/company.service';
import ShipService from '@app/core/services/rest/ship.service';
import ProductService from '@app/core/services/rest/product.service';
import DocumentService from '@app/core/services/rest/document.service';
import {objectToFormData} from 'object-to-formdata';
import {forkJoin} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {PermissionsService} from '@app/core/services/permissions.service';

@Component({
    selector: 'app-file-uploader',
    templateUrl: './file-uploader.component.html',
    styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent extends BaseComponentClass implements OnInit {
    files: any[] = [];
    form: FormGroup;
    companyOptions = [];
    shipOptions = [];
    productOptions = [];
    documentTypeOptions = [];

    constructor(private formBuilder: FormBuilder,
                private companyService: CompanyService,
                private shipService: ShipService,
                private productService: ProductService,
                private documentService: DocumentService,
                private toastrService: ToastrService) {
        super();
    }

    ngOnInit(): void {
        this.initForm();
        this.loadCompanyOptions();
        this.loadDocumentTypes();
    }

    onDeleteFile(index) {
        if (!this.files[index]) {
            return;
        }

        this.files.splice(index, 1);
    }

    onFileChanged(event) {
        const file = <File>event.target.files[0];
        const fileType = file.type.includes('image') ? 'image' : 'document';
        const fileObject = {
            file: file,
            type: fileType
        };

        this.getImageUrl(fileObject);
    }

    getImageUrl(fileObject: any) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
            fileObject.imageUrl = event.target.result;
            this.files.push(fileObject);
        };

        reader.onerror = (event: any) => {
            console.log('File could not be read: ' + event.target.error.code);
        };

        reader.readAsDataURL(fileObject.file);
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
            this.loadProductOptions(ship.id);
        }
    }

    onSubmit() {
        if (!this.form.valid) {
            return this.form.markAllAsTouched();
        }

        const requests = this.prepareApiRequests();
        this.subscriptions.sink = forkJoin(requests).subscribe(data => {
            this.form.reset();
            this.files = [];
            this.toastrService.success(`${requests.length} bestanden zijn succesvol toegevoegd`);
        });
    }

    private prepareApiRequests(): any[] {
        const requests = [];
        this.files.forEach(file => {
            const body = this.prepareBody(file.file);
            requests.push(this.documentService.createProduct(body));
        });

        return requests;
    }

    private prepareBody(file) {
        const values = this.form.value;
        values['file'] = file;
        return objectToFormData(values);
    }

    private loadDocumentTypes() {
        this.subscriptions.sink = this.documentService.getTypes().subscribe(data => {
            this.documentTypeOptions = data;
        });
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

    private loadProductOptions(ship_id?) {
        const params: any = {fields: 'id,name'};
        if (ship_id) {
            params.ship_id = ship_id;
        }
        this.subscriptions.sink = this.productService.getProducts(params).subscribe((resp: any) => {
            this.productOptions = resp.data;
        });
    }

    private initForm() {
        this.form = this.formBuilder.group({
            company_id: [null, {validators: [Validators.required], updateOn: 'blur'}],
            ship_id: [null, {validators: [Validators.required], updateOn: 'blur'}],
            product_id: [null, {updateOn: 'blur'}],
            document_type_id: [null, {validators: [Validators.required], updateOn: 'blur'}],
        });
    }
}
