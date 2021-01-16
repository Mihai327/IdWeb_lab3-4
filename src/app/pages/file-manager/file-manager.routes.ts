import {Routes} from '@angular/router';
import {AuthGuardService} from '@app/core';
import {FileExplorerComponent} from '@app/pages/file-manager/file-explorer/file-explorer.component';
import {FileUploaderComponent} from '@app/pages/file-manager/file-uploader/file-uploader.component';

export const FileManagerRoutes: Routes = [
    {
        path: '',
        component: FileExplorerComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'add',
        component: FileUploaderComponent,
        canActivate: [AuthGuardService],
        data: {
            minUserType: 1
        }
    }
];
