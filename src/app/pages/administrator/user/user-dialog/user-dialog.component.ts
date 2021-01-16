import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import UserService from '@app/core/services/rest/user.service';
import BaseComponentClass from '@app/core/class/BaseComponent.class';
import CompanyService from '@app/core/services/rest/company.service';
import {PermissionsService} from '@app/core/services/permissions.service';
import {Roles} from '@app/core/model/roles.model';

@Component({
    selector: 'app-user-dialog',
    templateUrl: './user-dialog.component.html',
    styleUrls: ['./user-dialog.component.scss'],
})
export class UserDialogComponent extends BaseComponentClass implements OnInit {
    @Input() title;
    @Input() user: any;
    @Input() formOptions: any;

    form: FormGroup;
    errors: any = {};

    constructor(
        public activeModal: NgbActiveModal,
        public companyService: CompanyService,
        private formBuilder: FormBuilder,
        private userService: UserService,
        private permissionsService: PermissionsService
    ) {
        super();
    }

    ngOnInit(): void {
        this.initForm();
    }

    onSubmit() {
        if (!this.form.valid) {
            return this.form.markAllAsTouched();
        }

        const body = this.prepareBody();
        this.form.disable();
        this.subscriptions.sink = this.userService.createUser(body).subscribe(
            (result) => {
                this.activeModal.close({user: result});
            },
            (err) => {
                if (err.status === 422) {
                    this.errors = err.error.errors;
                }
                this.form.enable();
            }
        );
    }

    onChangeUserType(type) {
        this.disableCompanyField(type.id);
    }

    private initForm() {
        this.form = this.formBuilder.group({
            first_name: [
                '',
                {validators: [Validators.required], updateOn: 'blur'},
            ],
            last_name: [
                '',
                {validators: [Validators.required], updateOn: 'blur'},
            ],
            email: [
                '',
                {
                    validators: [Validators.required, Validators.email],
                    updateOn: 'blur',
                },
            ],
            company_id: [
                null,
                {validators: [Validators.required], updateOn: 'blur'},
            ],
            type_id: [
                null,
                {validators: [Validators.required], updateOn: 'blur'},
            ],
            phone: [
                '',
                {validators: [Validators.required], updateOn: 'blur'},
            ],
        });
    }

    private prepareBody() {
        return this.form.value;
    }

    private disableCompanyField(selectedTypeId: number) {
        const field = this.form.get('company_id');

        if (this.permissionsService.isAdminUser() && Number(selectedTypeId) === Roles.Team) {
            field.disable();
            field.reset();
        } else {
            field.enable();
        }
    }
}
