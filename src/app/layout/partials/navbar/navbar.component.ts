import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbDropdownConfig, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from '@app/core';
import BaseComponentClass from '@app/core/class/BaseComponent.class';
import {ProfileService} from '@app/core/services/rest/profile.service';
import {environment} from '@env/environment';
import {PermissionsService} from '@app/core/services/permissions.service';
import {DashboardModalComponent} from '@app/pages/dashboard/dashboard-modal/dashboard-modal.component';
import {SettingsService} from '@app/core/services/rest/settings.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    providers: [NgbDropdownConfig],
})
export class NavbarComponent extends BaseComponentClass implements OnInit {
    @ViewChild('modalBodyTpl', {static: true}) modalBodyTpl: TemplateRef<any>;
    sidebarOpened = false;
    isAdmin = false;
    profile;
    contactPerson;

    toggleOffcanvas() {
        this.sidebarOpened = !this.sidebarOpened;
        if (this.sidebarOpened) {
            document.querySelector('.navbar').classList.add('header-toggled');
            document
                .querySelector('.navbar .nav-bottom')
                .classList.add('header-toggled');
        } else {
            document
                .querySelector('.navbar')
                .classList.remove('header-toggled');
            document
                .querySelector('.navbar .nav-bottom')
                .classList.remove('header-toggled');
        }
    }

    constructor(
        config: NgbDropdownConfig,
        public authService: AuthService,
        public permissionsService: PermissionsService,
        private profileService: ProfileService,
        private settingsService: SettingsService,
        private modalService: NgbModal
    ) {
        super();
        config.placement = 'bottom-right';
    }

    ngOnInit() {
        this.isAdmin = this.permissionsService.isAdminUser();
        this.subscriptions.sink = this.profileService.profile$.subscribe(
            (profile) => {
                this.profile = profile;
            }
        );

        this.subscriptions.sink = this.settingsService.contactPerson$.subscribe((contactPerson) => {
            this.contactPerson = contactPerson;
        });
    }

    onOpenContact() {
        const modalRef = this.modalService.open(DashboardModalComponent);
        modalRef.componentInstance.title = 'Contact opnemen';
        modalRef.componentInstance.object = {};
        modalRef.componentInstance.template = this.modalBodyTpl;
        modalRef.componentInstance.service = {};
        modalRef.componentInstance.placeholder = 'Schrijf hier uw bericht...';
        modalRef.componentInstance.textButton = 'Bericht verzenden';
        modalRef.componentInstance.submitFunction = 'contactPerson';

        modalRef.result
            .then((result) => {
                return true;
            })
            .catch(() => {
                return false;
            });
    }

    get profileImage() {
        return this.profile && this.profile.profile_picture
            ? environment.sourceUrl + this.profile.profile_picture
            : 'assets/images/profile/empty.png';
    }

    get profileSubTitle() {
        const companyName =
            (this.profile &&
                this.profile.company &&
                this.profile.company.name) ||
            '';
        return this.isAdmin ? 'Administrator' : companyName;
    }

    get displayContactPersonButton(): boolean {
        return this.profile && this.contactPerson && this.profile.email !== this.contactPerson.email;
    }
}
