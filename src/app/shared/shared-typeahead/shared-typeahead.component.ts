import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {debounceTime, distinctUntilChanged, filter, map, merge} from 'rxjs/operators';

import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-shared-typeahead',
    templateUrl: './shared-typeahead.component.html',
    styleUrls: ['./shared-typeahead.component.scss']
})
export class SharedTypeaheadComponent implements OnInit {
    @ViewChild('instance', {static: true}) instance: NgbTypeahead;

    @Input() data: any;
    @Input() attribute: string;

    focus$ = new Subject<string>();
    click$ = new Subject<string>();
    typeaheadModel: any;
    formatter = (result: any) => result.name;

    focusSearch = (text$: Observable<string>) =>
        text$
            .pipe(
                debounceTime(200),
                distinctUntilChanged(),
                merge(this.focus$),
                merge(this.click$.pipe(filter(() => !this.instance.isPopupOpen()))),
                map(term => (term === ''
                    ? this.data :
                    this.data.filter(v => v[this.attribute].toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
            )

    constructor() {
    }

    ngOnInit(): void {
    }

}
