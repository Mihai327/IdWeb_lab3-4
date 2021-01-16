import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PaginationInstance} from 'ngx-pagination';
import t from 'typy';

@Component({
    selector: 'app-table-async',
    templateUrl: './table-async.component.html',
    styleUrls: ['./table-async.component.scss']
})
export class TableAsyncComponent implements OnInit {
    @Input() columns: any[] = [];
    @Input() isLoading = false;

    @Input() asyncRow;

    @Input() rowClass = ''; // for example: 'custom-class'

    @Input() whenApplyRowClass = ''; // the name of the field that, if it has value, applies to the row, the class set in the `rowClass`

    @Input() showPagination = true;

    @Input()
    set meta(meta: any) {
        this._meta = meta;
        this.config.currentPage = meta && meta.current_page || 1;
        this.config.itemsPerPage = meta && meta.per_page || 10;
        this.config.totalItems = meta && meta.total;
    }

    @Output() onPage = new EventEmitter();
    @Output() onClickRow = new EventEmitter();

    public config: PaginationInstance = {
        id: 'custom',
        itemsPerPage: 5,
        currentPage: 1,
        totalItems: 0
    };

    private _meta = {};

    constructor() {
    }

    ngOnInit(): void {
    }

    pageChange(event) {
        this.onPage.emit(event);
    }

    get meta() {
        return this._meta;
    }

    get currentPage() {
        return this.meta && this.meta.current_page || 1;
    }

    get total() {
        return this.meta && this.meta.total || 0;
    }

    getValue(object, prop) {
        return t(object, prop).safeObject;
    }
}
