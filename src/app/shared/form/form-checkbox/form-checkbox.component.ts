import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
    selector: 'shared-checkbox',
    templateUrl: './form-checkbox.component.html',
    styleUrls: ['./form-checkbox.component.scss']
})
export class FormCheckboxComponent {

    @Input()
    label: string;

    @Input()
    controlName: string;

    @Input()
    group: FormGroup;

    @Input()
    groupName = '';

    @Input()
    containerClass = '';

    get control() {
        return !this.groupName ? this.group.get(this.controlName) : this.group.get(this.groupName);
    }
}
