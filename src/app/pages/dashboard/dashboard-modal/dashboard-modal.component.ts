import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import BaseComponentClass from '@app/core/class/BaseComponent.class';
import {NgForm} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {SettingsService} from '@app/core/services/rest/settings.service';
import {environment} from '@env/environment.prod';
import EmailService from '@app/core/services/rest/email.service';

@Component({
    selector: 'app-dashboard-modal',
    templateUrl: './dashboard-modal.component.html',
    styleUrls: ['./dashboard-modal.component.scss'],
})
export class DashboardModalComponent extends BaseComponentClass implements OnInit {
    @ViewChild('form') form: NgForm;
    @Input() title = '';
    @Input() object;
    @Input() service;
    @Input() template: TemplateRef<any>;
    @Input() placeholder = '';
    @Input() textButton = '';
    @Input() submitFunction: string;
    @Input() submitBody = {};
    messageControl = '';

    contactPerson;

    constructor(
        public activeModal: NgbActiveModal,
        private settingsService: SettingsService,
        private toastrService: ToastrService,
        private emailService: EmailService
    ) {
        super();
    }

    ngOnInit() {
        this.subscriptions.sink = this.settingsService.contactPerson$.subscribe(contactPerson => {
           this.contactPerson = contactPerson;
        });
    }

    onSubmit() {
        const body = Object.assign(this.submitBody, {message: this.messageControl});
        this.subscriptions.sink = this.emailService[this.submitFunction](body).subscribe(data => {
            this.toastrService.success('Uw contactpersoon neemt z.s.m contact met uw op');
            this.activeModal.close();
        });

    }

    get contactPersonProfileImage() {
        return this.contactPerson && this.contactPerson.profile_picture
            ? environment.sourceUrl + this.contactPerson.profile_picture
            : 'assets/images/profile/empty.png';
    }
}
