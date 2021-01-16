import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {environment} from '@env/environment';

@Component({
    selector: 'shared-form-file',
    templateUrl: './form-file.component.html',
    styleUrls: ['./form-file.component.scss']
})
export class FormFileComponent {
    sourceUrl = environment.sourceUrl;

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
    multiple = true;

    @Output()
    focus: EventEmitter<any> = new EventEmitter();

    @Output()
    focusOut: EventEmitter<any> = new EventEmitter();

    get control() {
        return !this.groupName ? this.group.get(this.controlName) : this.group.get(this.groupName).get(this.controlName);
    }

    onFile(file) {
    }
}
