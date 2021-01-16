import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import BaseComponentClass from '@app/core/class/BaseComponent.class';
import {MaintenanceService} from '@app/core/services/rest/maintenance.service';
import {ToastrService} from 'ngx-toastr';
import {CFG} from '@app/core/config/config';
import {PermissionsService} from '@app/core/services/permissions.service';
import {forkJoin} from 'rxjs';

@Component({
    selector: 'app-maintenance-status',
    templateUrl: './maintenance-status.component.html',
    styleUrls: ['./maintenance-status.component.scss'],
})
export class MaintenanceStatusComponent extends BaseComponentClass
    implements OnInit {
    @Input() statusList = [];
    @Input() maintenance: any = {};
    @Output() changeStatus = new EventEmitter();
    @Output() saveNewStatus = new EventEmitter();

    showEditStatusTpl = false;
    showColors = false;
    showNewStatusBtn = true;
    colors = CFG.statusColors;
    isAdmin;

    constructor(
        private maintenanceService: MaintenanceService,
        private toastrService: ToastrService,
        private permissionService: PermissionsService
    ) {
        super();
    }

    ngOnInit(): void {
        this.isAdmin = this.permissionService.isAdminUser();
    }

    onChangeStatus(status) {
        this.changeStatus.emit(status);
    }

    onAddNewStatus() {
        this.statusList.push({name: '', color: '#77b2d6', state: 'new'});
        this.showNewStatusBtn = false;
    }

    onEditStatusColor(statusItem) {
        this.statusList.forEach(
            (item) => item !== statusItem && (item.active = false)
        );
        this.showColors = statusItem.active = statusItem.active ? false : true;
    }

    onChangeColor(color: string) {
        this.statusList.find((item) => {
            if (item.active) {
                item.color = color;
                item.state = item.state === 'new' ? 'new' : 'updated';
            }
        });
    }

    onChangeValue(item, value) {
        item.name = value;
        item.state = item.state === 'new' ? 'new' : 'updated';
    }

    onSaveStatus() {
        const apiCalls = [];
        this.statusList.forEach((item) => {
            if (item.state === 'new') {
                apiCalls.push(this.maintenanceService.createStatus(item));
            } else if (item.state === 'updated') {
                apiCalls.push(this.maintenanceService.updateStatus(item.id, item));
            }
        });

        this.subscriptions.sink = forkJoin(apiCalls).subscribe(data => {
            this.saveNewStatus.emit();
            this.toastrService.success(
                'You have updated the statuses well'
            );
            this.showNewStatusBtn = true;
            this.showEditStatusTpl = false;
            this.showColors = false;
        });
    }
}
