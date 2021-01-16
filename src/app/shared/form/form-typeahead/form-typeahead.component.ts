import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Subject} from 'rxjs/Subject';
import {concat, of} from 'rxjs';
import {catchError, distinctUntilChanged, map, switchMap, tap} from 'rxjs/operators';
import {isArray} from 'util';

@Component({
    selector: 'shared-form-typeahead',
    templateUrl: './form-typeahead.component.html',
    styleUrls: ['./form-typeahead.component.scss']
})
export class FormTypeaheadComponent implements OnInit {
    @Input()
    label: string;

    @Input()
    placeholder: string;

    @Input()
    controlName: string;

    @Input()
    group: FormGroup;

    @Input()
    groupName: string;

    @Input()
    serverService: any;

    @Input()
    serverServiceFunction: string;

    @Input()
    serverServiceFunctionParams: any;

    @Input()
    defaultOptions = [];


    @Input()
    bindLabel = 'name';

    @Input()
    bindValue = 'id';

    @Input() bindLabelArray = [];

    @Input() addTag = false;

    options$;
    typeAheadInput$ = new Subject<string>();
    optionsLoading = false;

    ngOnInit() {
        this.loadData();
    }

    private loadData() {
        this.options$ = concat(
            of(this.defaultOptions), // default items
            this.typeAheadInput$.pipe(
                distinctUntilChanged(),
                tap(() => this.optionsLoading = true),
                switchMap(term => {
                    const params = term && {search: term} || {};
                    return this.serverService[this.serverServiceFunction](Object.assign(this.serverServiceFunctionParams, params)).pipe(
                        map((resp: any) => {
                            const data = resp.data;
                            if (Array.isArray(data) && this.bindLabelArray.length) {
                                data.forEach(item => {
                                    let label = '';
                                    this.bindLabelArray.forEach(key => {
                                        label += item[key] + ' ';
                                    });
                                    item[this.bindLabel] = label.trim();
                                });
                            }
                            return data;
                        }),
                        catchError(() => of([])), // empty list on error
                        tap(() => this.optionsLoading = false)
                    );
                })
            )
        );
    }

    get control() {
        return this.group.get(this.controlName);
    }

    get groupcontrol() {
        return (this.group.get(this.groupName) as FormGroup).get(this.controlName);
    }
}
