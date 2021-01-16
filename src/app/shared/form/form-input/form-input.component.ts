import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';


@Component({
    selector: 'shared-form-input',
    templateUrl: './form-input.component.html',
    styleUrls: ['./form-input.component.scss']
})
export class FormInputComponent implements OnInit {

    @Input()
    controlName: string;

    @Input()
    label: string;

    @Input()
    subLabel: string;

    @Input()
    labelClass: string;

    @Input()
    controlClass: string;

    @Input()
    placeholder: string;

    @Input()
    afterGroupIcon: string;

    @Input()
    afterGroupTooltip: string;

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

    @Input()
    apiError;

    @Output()
    focus: EventEmitter<any> = new EventEmitter();

    @Output()
    focusOut: EventEmitter<any> = new EventEmitter();

    ngOnInit() {
    }

    get control() {
        return !this.groupName ? this.group.get(this.controlName) : this.group.get(this.groupName).get(this.controlName);
    }
}
