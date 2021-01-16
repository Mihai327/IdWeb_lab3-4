import {Injectable} from '@angular/core';
import {ApiService} from '@app/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';

@Injectable({
    providedIn: 'root'
})
export default class DocumentService {
    private url = environment.apiUrl + '/document/download';

    constructor(
        private http: HttpClient,
        private apiService: ApiService) {
    }

    getDocument(params) {
        return this.http.get(this.url, {responseType: 'blob', params});
    }

    getSystem(params = {}) {
        return this.apiService.get('document/system', params);
    }

    getTypes() {
        return this.apiService.get('document/types', {});
    }

    createProduct(body) {
        return this.apiService.post('document', body, {forFile: 'true'});
    }

    updateDocument(id: number, body: any) {
        return this.apiService.put(`document/${id}`, body);
    }

    deleteDocument(id: number) {
        return this.apiService.delete(`document/${id}`);
    }
}
