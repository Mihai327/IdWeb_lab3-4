import {Injectable} from '@angular/core';
import {ApiService} from '@app/core';

@Injectable({
    providedIn: 'root'
})
export default class EmailService {
    constructor(
        private apiService: ApiService) {
    }

    contactPerson(body: any) {
        return this.apiService.post('email/contact', body);
    }

    product(body: any) {
        return this.apiService.post('email/product', body);
    }

    maintenance(body: any) {
        return this.apiService.post('email/maintenance', body);
    }

}
