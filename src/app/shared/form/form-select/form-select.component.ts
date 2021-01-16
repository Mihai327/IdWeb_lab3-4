import {Component, Input, Output, EventEmitter} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
    selector: 'shared-form-select',
    templateUrl: './form-select.component.html',
    styleUrls: ['./form-select.component.scss']
})
export class FormSelectComponent {
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
    options: any[];

    @Input()
    multi: boolean = false;

    @Input()
    maxSelectedItems = null;

    @Input()
    bindLabel = 'name';

    @Input()
    bindValue = 'id';

    @Input()
    addTag = false;

    @Output()
    change = new EventEmitter();

    get control() {
        return this.group.get(this.controlName);
    }

    get groupcontrol() {
        return (this.group.get(this.groupName) as FormGroup).get(this.controlName);
    }

    onChange(event) {
        this.change.emit(event);
    }
}
