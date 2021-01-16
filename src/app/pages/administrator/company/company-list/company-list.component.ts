import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import CompanyService from '@app/core/services/rest/company.service';
import BaseComponentClass from '@app/core/class/BaseComponent.class';
import {environment} from '@env/environment';
import {Company} from '@app/core/model/company.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CompanyDialogComponent} from '@app/pages/administrator/company/company-dialog/company-dialog.component';
import {CompanyConstants} from '@app/pages/administrator/company/company.const';
import {ConfirmationDialogComponent} from '@app/shared/confirmation-dialog/confirmation-dialog.component';
import {map, tap} from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-company-list',
    templateUrl: './company-list.component.html',
    styleUrls: ['./company-list.component.scss'],
})
export class CompanyListComponent extends BaseComponentClass implements OnInit {
    @ViewChild('companyLogoTemplate', {static: true})
    companyLogoTemplate: TemplateRef<any>;
    @ViewChild('actionTemplate', {static: true}) actionTemplate: TemplateRef<any>;
    @ViewChild('modalBodyTpl', {static: true}) modalBodyTpl: TemplateRef<any>;
    @ViewChild('activateBodyTpl', {static: true}) activateBodyTpl: TemplateRef<any>;

    sourceUrl = environment.sourceUrl;

    columns: any[];
    rows: Company[];
    asyncCompanies;
    isLoading = true;
    meta;
    selectedCompany;
    showDeactivatedEntries = {};

    constructor(
        private companyService: CompanyService,
        private modalService: NgbModal,
        private toastrService: ToastrService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.columns = [
            {
                Name: 'Logo',
                Prop: 'logo',
                cellTemplate: this.companyLogoTemplate,
            },
            {Name: 'Bedrijfsnaam', Prop: 'name'},
            {Name: 'Contact Emailadres', Prop: 'contact_email'},
            {Name: 'Telefoonnummer', Prop: 'phone_number'},
            {Name: 'Acties', Prop: 'id', cellTemplate: this.actionTemplate},
        ];

        this.loadData(1);
    }

    pageChanged($event) {
        this.loadData($event);
    }

    loadData(page) {
        this.isLoading = true;
        const params: any = {
            page,
            ...this.showDeactivatedEntries
        };

        if (this.selectedCompany && this.selectedCompany.id) {
            params.id = this.selectedCompany.id;
        }
        this.asyncCompanies = this.companyService.getCompanies(params).pipe(
            tap((res: any) => {
                this.meta = res.meta;
                this.isLoading = false;
            }),
            map((res: any) => res.data)
        );
    }

    onSelectCompany(selectedCompany) {
        this.selectedCompany = selectedCompany;
        this.loadData(this.meta.current_page);
    }

    onCreateCompany() {
        this.openCompanyDialog(CompanyConstants.newItemDialogTitle);
    }

    onUpdateCompany(company: Company) {
        this.openCompanyDialog(CompanyConstants.editItemDialogTitle, company);
    }

    onDeleteCompany(company: Company) {
        const modalRef = this.modalService.open(ConfirmationDialogComponent);
        modalRef.componentInstance.title = CompanyConstants.deleteDialogTitle;
        modalRef.componentInstance.row = company;
        modalRef.componentInstance.template = this.modalBodyTpl;
        modalRef.componentInstance.withForm = true;
        modalRef.componentInstance.pattern = 'DEACTIVEER';

        modalRef.result.then((result) => {
            if (result) {
                this.deleteCompany(company.id);
            }
        })
        .catch(() => {
            return false;
        });
    }

    onActivateCompany(company: Company) {
        const modalRef = this.modalService.open(ConfirmationDialogComponent);
        modalRef.componentInstance.title = CompanyConstants.activateDialogTitle;
        modalRef.componentInstance.row = company;
        modalRef.componentInstance.template = this.activateBodyTpl;

        modalRef.result.then((result) => {
            if (result) {
                this.activateCompany(company.id);
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

    private openCompanyDialog(title: string, company: Company = null) {
        const modalRef = this.modalService.open(CompanyDialogComponent);
        modalRef.componentInstance.title = title;
        modalRef.componentInstance.company = Object.assign({}, company);

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

    private deleteCompany(id: number) {
        this.subscriptions.sink = this.companyService
            .deleteCompany(id)
            .subscribe((result: any) => {
                this.toastrService.success(CompanyConstants.msgSuccessDelete);
                this.pageChanged(this.meta.current_page);
            });
    }

    private activateCompany(id: number) {
        this.subscriptions.sink = this.companyService
            .activateCompany(id)
            .subscribe((result: any) => {
                this.toastrService.success(CompanyConstants.msgSuccessActivate);
                this.pageChanged(this.meta.current_page);
            });
    }
}
