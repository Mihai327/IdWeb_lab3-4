import {Component, OnInit} from '@angular/core';
import {ProfileService} from '@app/core/services/rest/profile.service';
import {PermissionsService} from '@app/core/services/permissions.service';
import {SettingsService} from '@app/core/services/rest/settings.service';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

    constructor(
        private permissionsService: PermissionsService,
        private settingsService: SettingsService) {
    }

    ngOnInit(): void {
        this.settingsService.getSettings().subscribe();
        this.permissionsService.reload();
    }

}
