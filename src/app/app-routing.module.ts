import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {Page404Component} from './sample-pages/page404/page404.component';
import {Page500Component} from './sample-pages/page500/page500.component';
import {LayoutComponent} from '@app/layout/layout.component';
import {AuthGuardService} from '@app/core';

const routes: Routes = [
    {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuardService],
        canActivateChild: [AuthGuardService],
        children: [
            {
                path: 'administrator',
                loadChildren: () => import('./pages/administrator/administrator.module').then(m => m.AdministratorModule)
            },
            {
                path: 'profile',
                loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule)
            },
            {
                path: 'maintenance',
                loadChildren: () => import('./pages/maintenance/maintenance.module').then(m => m.MaintenanceModule)
            },
            {
                path: 'file',
                loadChildren: () => import('./pages/file-manager/file-manager.module').then(m => m.FileManagerModule)
            },
            {path: 'dashboard', component: DashboardComponent},
            {path: '404-page', component: Page404Component},
            {path: '500-page', component: Page500Component},
        ]
    },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
