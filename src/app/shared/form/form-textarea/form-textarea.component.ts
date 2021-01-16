import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
    selector: 'shared-form-textarea',
    templateUrl: './form-textarea.component.html',
    styleUrls: ['./form-textarea.component.scss']
})
export class FormTextareaComponent {
    @Input()
    controlName: string;

    @Input()
    groupName: string;

    @Input()
    label: string;

    @Input()
    placeholder: string;

    @Input()
    rows: number;

    @Input()
    group: FormGroup;

    @Output()
    focus: EventEmitter<any> = new EventEmitter();

    @Output()
    focusOut: EventEmitter<any> = new EventEmitter();

    get control() {
        return !this.groupName ? this.group.get(this.controlName) : this.group.get(this.groupName).get(this.controlName);
    }
}
