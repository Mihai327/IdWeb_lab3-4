import {Routes} from '@angular/router';
import {AuthGuardService} from '@app/core/auth';
import {MaintenanceListComponent} from '@app/pages/maintenance/maintenance-list/maintenance-list.component';
import { MaintenanceInspectionResolverService } from './maintenance-inspection/maintenance-inspection-resolver.service';
import { MaintenanceInspectionComponent } from './maintenance-inspection/maintenance-inspection.component';

export const MaintenanceRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/maintenance/list',
    },
    {
        path: 'list',
        component: MaintenanceListComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'inspect/:id',
        component: MaintenanceInspectionComponent,
        resolve: {resp: MaintenanceInspectionResolverService},
        canActivate: [AuthGuardService]
    }
];
