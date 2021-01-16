import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
    selector: 'shared-form-datepicker',
    templateUrl: './form-datepicker.component.html',
    styleUrls: ['./form-datepicker.component.scss']
})
export class FormDatepickerComponent {

    @Input()
    controlName: string;

    @Input()
    label: string;

    @Input()
    labelClass: string;

    @Input()
    controlClass: string;

    @Input()
    placeholder = '';

    @Input()
    type: string = 'text';

    @Input()
    group: FormGroup;

    @Input()
    groupName: string;

    @Input()
    wasSent = false;

    @Input()
    errorMessages;

    @Output()
    focus: EventEmitter<any> = new EventEmitter();

    @Output()
    focusOut: EventEmitter<any> = new EventEmitter();

    get control() {
        return !this.groupName ? this.group.get(this.controlName) : this.group.get(this.groupName).get(this.controlName);
    }

}
