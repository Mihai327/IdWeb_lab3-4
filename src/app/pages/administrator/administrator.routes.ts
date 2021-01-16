import {Routes} from '@angular/router';

import {AuthGuardService} from '@app/core/auth';
import {AdministratorComponent} from '@app/pages/administrator/administrator.component';
import {CompanyListComponent} from '@app/pages/administrator/company/company-list/company-list.component';
import {UserListComponent} from '@app/pages/administrator/user/user-list/user-list.component';
import {ShipListComponent} from '../ship/ship-list/ship-list.component';
import {ProductListComponent} from '../product/product-list/product-list.component';
import {ShipDetailComponent} from '@app/pages/ship/ship-detail/ship-detail.component';
import {MaintenanceInspectionResolverService} from '@app/pages/maintenance/maintenance-inspection/maintenance-inspection-resolver.service';
import {ShipDetailResolverService} from '@app/pages/ship/ship-detail/ship-detail-resolver.service';
import {ProductDetailComponent} from '@app/pages/product/product-detail/product-detail.component';
import {ProductDetailResolverService} from '@app/pages/product/product-detail/product-detail-resolver.service';

export const AdministratorRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/administrator/company'
    },
    {
        path: '',
        component: AdministratorComponent,
        canActivate: [AuthGuardService],
        canActivateChild: [AuthGuardService],
        children: [
            {
                path: 'company',
                component: CompanyListComponent,
                canActivate: [AuthGuardService],
                data: {
                    tab: 'company',
                    minUserType: 1
                }
            },
            {
                path: 'user',
                component: UserListComponent,
                canActivate: [AuthGuardService],
                data: {
                    tab: 'user',
                    minUserType: 1
                }
            },
            {
                path: 'ships',
                component: ShipListComponent,
                canActivate: [AuthGuardService],
                data: {
                    tab: 'ships',
                    minUserType: 1
                }
            },
            {
                path: 'products',
                component: ProductListComponent,
                canActivate: [AuthGuardService],
                data: {
                    tab: 'products',
                    minUserType: 1
                }
            }
        ]
    },
    {
        path: 'ships/:id',
        component: ShipDetailComponent,
        resolve: {resp: ShipDetailResolverService},
        canActivate: [AuthGuardService],
    },
    {
        path: 'products/:id',
        component: ProductDetailComponent,
        canActivate: [AuthGuardService],
        resolve: {resp: ProductDetailResolverService},
    },
];
