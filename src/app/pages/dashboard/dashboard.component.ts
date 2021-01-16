import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MaintenanceService} from '@app/core/services/rest/maintenance.service';
import {tap, map} from 'rxjs/operators';
import {ProfileService} from '@app/core/services/rest/profile.service';
import ShipService from '@app/core/services/rest/ship.service';
import BaseComponentClass from '@app/core/class/BaseComponent.class';
import {DashboardModalComponent} from '@app/pages/dashboard/dashboard-modal/dashboard-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {environment} from '@env/environment';
import {PermissionsService} from '@app/core/services/permissions.service';
import {of} from 'rxjs';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends BaseComponentClass implements OnInit {
    @ViewChild('actionTemplate', {static: true}) actionTemplate: TemplateRef<any>;
    @ViewChild('nameTemplate', {static: true}) nameTemplate: TemplateRef<any>;
    @ViewChild('statusTemplate', {static: true}) statusTemplate: TemplateRef<any>;
    @ViewChild('dateTemplate', {static: true}) dateTemplate: TemplateRef<any>;
    @ViewChild('upcomingTemplate', {static: true}) upcomingTemplate: TemplateRef<any>;
    @ViewChild('problemTemplate', {static: true}) problemTemplate: TemplateRef<any>;
    @ViewChild('linkTpl', {static: true}) linkTpl: TemplateRef<any>;
    @ViewChild('modalMaintenanceTpl', {static: true}) modalMaintenanceTpl: TemplateRef<any>;
    @ViewChild('modalProblemTpl', {static: true}) modalProblemTpl: TemplateRef<any>;

    columnsMaintenance: any[];
    columnsShip: any[];
    asyncMaintenance;
    ships;
    isLoadingMaintenance = true;
    meta = {
        current_page: 1,
        per_page: 3,
    };
    profile: { [key: string]: any } = {};
    sourceUrl = environment.sourceUrl;
    isAdmin;
    loading = {ships: true, maintenance: true};
    maintenanceEmptyState = false;

    constructor(
        private maintenanceService: MaintenanceService,
        private shipService: ShipService,
        private profileService: ProfileService,
        private modalService: NgbModal,
        private permissionsService: PermissionsService
    ) {
        super();
    }

    ngOnInit(): void {
        this.isAdmin = this.permissionsService.isAdminUser();
        this.buildColumns();
        this.loadData();
        this.loadProfileData();
    }

    private loadData() {
        this.asyncMaintenance = this.maintenanceService.getMaintenances().pipe(
            tap((res: any) => {
                this.isLoadingMaintenance = false;
                this.maintenanceEmptyState = !res.data.length;
            }),
            map((res: any) => res.data)
        );

        this.loading.ships = true;
        this.subscriptions.sink = this.shipService.getShips({expand: 'products'}).subscribe((response: any) => {
            this.ships = response.data;
            this.ships.forEach(ship => {
                ship.productAsync = of(ship.products);
            });
            this.loading.ships = false;
        });
    }

    private loadProfileData() {
        this.profileService.profile$.subscribe((profile) => {
            this.profile = profile;
        });
    }

    private buildColumns() {
        this.columnsMaintenance = [
            {Name: 'Datum', Prop: 'date', cellTemplate: this.dateTemplate},
            {
                Name: 'Product',
                Prop: 'product',
                cellTemplate: this.linkTpl,
                routerLink: '/administrator/products',
            },
            {
                Name: 'Schip',
                Prop: 'product.ship',
                cellTemplate: this.linkTpl,
                routerLink: '/administrator/ships',
            },
            {Name: 'Categorie', Prop: 'category.name'},
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
            {
                Name: 'Acties',
                Prop: 'id',
                cellTemplate: this.actionTemplate,
                routerLink: '/maintenance/inspect',
                label: 'Bekijken',
            },
        ];

        this.columnsShip = [
            {
                Name: 'Product',
                cellTemplate: this.linkTpl,
                routerLink: '/administrator/products',
            },
            {
                Name: 'Acties',
                Prop: 'id',
                cellTemplate: this.problemTemplate,
            },
            {
                Name: 'Aankomend onderhoud',
                Prop: 'upcoming_maintenance',
                cellTemplate: this.upcomingTemplate,
            },
        ];
    }

    onOpenInplannenModal(product: any) {
        const ship = this.ships.find((item: any) => +item.id === +product.ship_id);
        const modalRef = this.modalService.open(DashboardModalComponent);

        modalRef.componentInstance.title = 'Onderhaud inplannen';
        modalRef.componentInstance.object = {ship: ship.name, product: product.name};
        modalRef.componentInstance.template = this.modalMaintenanceTpl;
        modalRef.componentInstance.service = {};
        modalRef.componentInstance.placeholder = 'Eventuele opmerkingen of voorkeuren kunt u hier achterlaten...';
        modalRef.componentInstance.textButton = 'Ik wil graag dat mijn contactpersoon contact op zoekt';
        modalRef.componentInstance.textButton = 'Bericht verzenden';
        modalRef.componentInstance.submitFunction = 'maintenance';
        modalRef.componentInstance.submitBody = {product_id: product.id};

        modalRef.result
            .then((result) => {
                return true;
            })
            .catch(() => {
                return false;
            });
    }

    onOpenProblemModal(product: any) {
        const ship = this.ships.find((item: any) => +item.id === +product.ship_id);
        const modalRef = this.modalService.open(DashboardModalComponent);

        modalRef.componentInstance.title = 'Probleem melden';
        modalRef.componentInstance.object = {ship: ship.name, product: product.name};
        modalRef.componentInstance.template = this.modalProblemTpl;
        modalRef.componentInstance.service = {};
        modalRef.componentInstance.placeholder = 'Beschrijf hier uw probleem...';
        modalRef.componentInstance.textButton = 'Probleem melden';
        modalRef.componentInstance.submitFunction = 'product';
        modalRef.componentInstance.submitBody = {product_id: product.id};

        modalRef.result
            .then((result) => {
                return true;
            })
            .catch(() => {
                return false;
            });
    }
}
