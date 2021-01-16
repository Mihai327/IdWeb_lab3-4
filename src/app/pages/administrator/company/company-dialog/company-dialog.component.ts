import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Company} from '@app/core/model/company.model';
import CompanyService from '@app/core/services/rest/company.service';
import BaseComponentClass from '@app/core/class/BaseComponent.class';
import {objectToFormData} from 'object-to-formdata';
import {UtilService} from '@app/core';
import {FileUploadValidators} from '@iplab/ngx-file-upload';
import {CompanyConstants} from '@app/pages/administrator/company/company.const';
import UserService from '@app/core/services/rest/user.service';

@Component({
    selector: 'app-company-dialog',
    templateUrl: './company-dialog.component.html',
    styleUrls: ['./company-dialog.component.scss']
})
export class CompanyDialogComponent extends BaseComponentClass implements OnInit {
    @Input() title: string;
    @Input() company: Company;

    form: FormGroup;
    editMode = false;
    teamMemberOptions;

    constructor(
        public activeModal: NgbActiveModal,
        private companyService: CompanyService,
        private formBuilder: FormBuilder,
        private userService: UserService,
        private utilService: UtilService) {
        super();
    }

    ngOnInit(): void {
        this.editMode = this.utilService.isEmptyOrNullObject(this.company) ? false : true;
        this.loadTeamUsers();
        this.initForm();
        this.patchForm();
    }

    onSubmit() {
        if (!this.form.valid) {
            return this.form.markAllAsTouched();
        }

        const body = this.prepareBody();
        const method = this.editMode
            ? this.companyService.updateCompany(this.company.id, body)
            : this.companyService.createCompany(body);

        this.form.disable();

        this.subscriptions.sink = method.subscribe((result: any) => {
            this.activeModal.close({company: result});
        }, (err) => {
            this.form.enable();
        });
    }

    private loadTeamUsers() {
        this.subscriptions.sink = this.userService.getUsers({
            fields: 'id,first_name,last_name', type_id: 3, per_page: 20
        }).subscribe((data: any) => {
            this.teamMemberOptions = data.data.map((user: any) => {
                user.name = `${user.first_name} ${user.last_name}`;
                return user;
            });
        });
    }

    private initForm() {
        this.form = this.formBuilder.group({
            name: ['', {validators: [Validators.required], updateOn: 'blur'}],
            contact_email: ['', {validators: [Validators.required, Validators.email], updateOn: 'blur'}],
            contact_person_id: ['', {validators: [Validators.required], updateOn: 'blur'}],
            phone_number: ['', {validators: [Validators.required], updateOn: 'blur'}],
            logo: [null, {validators: [Validators.required]}]
        });
    }

    private patchForm() {
        if (!this.editMode) {
            return;
        }

        const patchValue: any = Object.assign({}, this.company);
        patchValue.logo = [patchValue.logo];

        this.form.patchValue(patchValue);
    }

    private prepareBody() {
        const values = this.form.value;
        values.logo = values.logo[0];

        return objectToFormData(values);
    }

}
