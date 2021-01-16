import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
    selector: 'shared-form-radio',
    templateUrl: './form-radio.component.html',
    styleUrls: ['./form-radio.component.scss']
})
export class FormRadioComponent {
    @Input()
    controlName: string;

    @Input()
    label: string;

    @Input()
    type: string = 'text';

    @Input()
    formGroup: FormGroup;

    @Input()
    options: any[];
}
