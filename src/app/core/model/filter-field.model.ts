import {Subject} from 'rxjs';

export class FilterField {
    key: string;
    name: string;
    value?: any;
    placeholder?: string;
    type?: string;
    cssClasses?: [string];
    bindLabel?: string;
    bindValue?: string;
    selectOptions?: any[];
    typeaheadService?: any;
    typeaheadMethod?: string;
    typeaheadMethodParams?: {};
    typeaheadInput$?: Subject<string>;
    typeaheadOptions$?;
    typeaheadDefaultOptions?: [];
    typeToSearchText?: string;
    formatDate?: string;

    constructor(options: FilterField) {
        this.key = options.key;
        this.name = options.name;
        this.value = options.value;
        this.placeholder = options.placeholder || '';
        this.type = options.type || 'text';
        this.cssClasses = options.cssClasses || [''];
        this.bindLabel = options.bindLabel || 'name';
        this.bindValue = options.bindValue || 'id';
        this.selectOptions = options.selectOptions || [];
        this.typeaheadService = options.typeaheadService;
        this.typeaheadMethod = options.typeaheadMethod || 'getCompanies';
        this.typeaheadMethodParams = options.typeaheadMethodParams || {};
        this.typeaheadInput$ = new Subject<string>();
        this.typeToSearchText = options.typeToSearchText || 'Voer 2 of meer karakters in';
        this.typeaheadDefaultOptions = options.typeaheadDefaultOptions || [];
        this.formatDate = options.formatDate || 'yyyy-MM-dd';
    }
}
