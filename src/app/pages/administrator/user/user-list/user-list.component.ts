import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal, NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';

import UserService from '@app/core/services/rest/user.service';
import {ToastrService} from 'ngx-toastr';
import BaseComponentClass from '@app/core/class/BaseComponent.class';
import {UserDialogComponent} from '@app/pages/administrator/user/user-dialog/user-dialog.component';

import {map, tap} from 'rxjs/operators';
import {FilterField} from '@app/core/model/filter-field.model';
import {UserConstants} from '@app/pages/administrator/user/user.const';
import CompanyService from '@app/core/services/rest/company.service';
import {Company} from '@app/core/model/company.model';
import {ConfirmationDialogComponent} from '@app/shared/confirmation-dialog/confirmation-dialog.component';


@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent extends BaseComponentClass implements OnInit {
    @ViewChild('actionTemplate', {static: true}) actionTemplate: TemplateRef<any>;
    @ViewChild('nameTemplate', {static: true}) nameTemplate: TemplateRef<any>;
    @ViewChild('instance', {static: true}) instance: NgbTypeahead;
    @ViewChild('modalBodyTpl', {static: true}) modalBodyTpl: TemplateRef<any>;
    @ViewChild('activateBodyTpl', {static: true}) activateBodyTpl: TemplateRef<any>;

    columns: any[];
    asyncUsers;
    isLoading = true;
    meta;
    filterParams;
    searchFailed = false;
    filterFields: FilterField[] = [];
    userFormOptions;
    showDeactivatedEntries = {};

    constructor(
        private userService: UserService,
        private modalService: NgbModal,
        private companyService: CompanyService,
        private toastrService: ToastrService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.subscriptions.sink = this.userService.getUsersForm().subscribe((result: any) => {
            this.userFormOptions = result;
        });

        this.buildColumns();
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
            ...this.filterParams,
            expand: 'company,user_type',
            fields: 'id,first_name,last_name,email,company.name,user_type.name,deleted_at',
            ...this.showDeactivatedEntries
        };

        this.asyncUsers = this.userService.getUsers(params)
            .pipe(
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

    onCreateUser() {
        this.openUserDialog(UserConstants.newItemDialogTitle);
    }

    private openUserDialog(title: string, user: any = null) {
        const modalRef = this.modalService.open(UserDialogComponent);
        modalRef.componentInstance.title = title;
        modalRef.componentInstance.user = Object.assign({}, user);
        modalRef.componentInstance.formOptions = this.userFormOptions;

        modalRef.result.then(result => {
            if (result) {
                this.addOrUpdateUserLocal(result.user);
            }
        });
    }

    onDeleteUser(user: any) {
        const modalRef = this.modalService.open(ConfirmationDialogComponent);
        modalRef.componentInstance.title = UserConstants.deleteDialogTitle;
        modalRef.componentInstance.row = user;
        modalRef.componentInstance.template = this.modalBodyTpl;
        modalRef.componentInstance.withForm = true;
        modalRef.componentInstance.pattern = 'DEACTIVEER';

        modalRef.result.then((result) => {
            if (result) {
                this.deleteUser(user.id);
            }
        })
        .catch(() => {
            return false;
        });
    }

    onShowDeactivatedEntries(event) {
        if (event.target.checked) {
            this.showDeactivatedEntries = {trashed: 1};
        } else {
            delete this.showDeactivatedEntries['trashed'];
        }
        this.loadData(this.meta.current_page);
    }

    onActivateUser(user: any) {
        const modalRef = this.modalService.open(ConfirmationDialogComponent);
        modalRef.componentInstance.title = UserConstants.activateDialogTitle;
        modalRef.componentInstance.row = user;
        modalRef.componentInstance.template = this.activateBodyTpl;

        modalRef.result.then((result) => {
            if (result) {
                this.activateUser(user.id);
            }
        })
        .catch(() => {
            return false;
        });
    }

    private addOrUpdateUserLocal(user: any) {
        this.pageChanged(this.meta.current_page);
    }

    private buildColumns() {
        this.columns = [
            {Name: 'Emailadres', Prop: 'email'},
            {Name: 'Naam', Prop: 'name', cellTemplate: this.nameTemplate},
            {Name: 'Bedrijf', Prop: 'company.name'},
            {Name: 'Type', Prop: 'user_type.name'},
            {Name: 'Acties', Prop: 'id', cellTemplate: this.actionTemplate},
        ];
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
                placeholder: 'Voer naam of emailadres in'
            })
        ];
    }

    private deleteUser(id: number) {
        this.subscriptions.sink = this.userService
            .deleteUser(id)
            .subscribe((result: any) => {
                this.toastrService.success(UserConstants.msgSuccessDelete);
                this.pageChanged(this.meta.current_page);
            });
    }

    private activateUser(id: number) {
        this.subscriptions.sink = this.userService
            .activateUser(id)
            .subscribe((result: any) => {
                this.toastrService.success(UserConstants.msgSuccessActivate);
                this.pageChanged(this.meta.current_page);
            });
    }

}
