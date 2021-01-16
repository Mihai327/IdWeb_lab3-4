import { Injectable, EventEmitter } from '@angular/core';
import { ApiService } from '@app/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const MAINTENANCE_URL = 'maintenances';

@Injectable({
    providedIn: 'root'
})
export class MaintenanceService {
    constructor(private apiService: ApiService) {}

    getMaintenances(params = {}): Observable<any[]> {
        const expand =
            'product,product.ship,product.ship.company,inspector,category,status,work_type,contact_person';
        const fields =
            'contact_person.id,contact_person.first_name,contact_person.last_name,work_type.id,work_type.name,id,date,product.name,product.id,product.ship.name,product.ship.id,product.ship.company.name,product.ship.company.id,category,inspector.id,inspector.profile_picture,inspector.first_name,inspector.last_name,status';
        return this.apiService
            .get(MAINTENANCE_URL, { expand, fields, ...params })
            .pipe(map((resp: any) => resp));
    }

    getMaintenanceForm(params = {}): Observable<any[]> {
        return this.apiService
            .get(`${MAINTENANCE_URL}/form`, params)
            .pipe(map((resp: any) => resp));
    }

    createMaintenance(body) {
        return this.apiService.post(MAINTENANCE_URL, body);
    }

    updateMaintenance(id: number, body) {
        const url = `${MAINTENANCE_URL}/${id}`;
        return this.apiService.put(url, body);
    }

    deleteMaintenance(id: number) {
        const url = `${MAINTENANCE_URL}/${id}`;
        return this.apiService.delete(url);
    }

    getMaintenanceItem(id: number) {
        const expand =
            'product,product.ship,product.ship.company,inspector,status,category,work_type,contact_person,documents,comments,comments.user';
        const fields =
            'id,date,product.name,product.ship.name,product.ship.id,product.ship.company.name,category,inspector.id,inspector.first_name,inspector.last_name,status,product.ship.company.id,work_type,contact_person,documents';
        return this.apiService.get(`${MAINTENANCE_URL}/${id}`, {
            expand,
            fields,
        });
    }

    createDocument(id: number, body) {
        const url = `${MAINTENANCE_URL}/document/${id}`;
        return this.apiService.post(url, body, {forFile: 'true'});
    }

    deleteFile(maintenanceId: number, fileId: number) {
        const url = `${MAINTENANCE_URL}/${maintenanceId}/document/${fileId}`;
        return this.apiService.delete(url);
    }

    createStatus(body) {
        return this.apiService.post(`${MAINTENANCE_URL}/statuses`, body);
    }

    updateStatus(id, body) {
        return this.apiService.post(`${MAINTENANCE_URL}/statuses/${id}`, body);
    }
}
