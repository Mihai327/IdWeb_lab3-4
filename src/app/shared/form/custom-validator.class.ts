import {FormGroup, ValidatorFn, AbstractControl} from '@angular/forms';

// custom validator to check that two fields match
export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.get(controlName);
        const matchingControl = formGroup.get(matchingControlName);

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({mustMatch: true});
        } else {
            matchingControl.setErrors(null);
        }
    };
}

export function DateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const value = control.value;
        const err = {invalidDate: {value: value}};
        if (value.length) {
            const reg: RegExp = /^\d{4}[-]\d{2}[-]\d{2}$/;
            const test = reg.test(value);
            if (test) {
                const year = +value.substr(0, 4);
                const month = +value.substr(5, 2) - 1;
                const day = +value.substr(8, 2);
                const date = new Date(value);
                return date.getTime() === date.getTime() &&
                year === date.getFullYear() &&
                month === date.getMonth() &&
                day === date.getDate()
                    ? null
                    : err;
            } else {
                return err;
            }
        } else {
            return null;
        }
    };
}

export function urlValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const value = control.value;
        const err = {invalidUrl: {value: value}};
        const urlRegex = new RegExp(
            '^(?:(?:https?|ftp):\\/\\/)?(?:\\S+(?::\\S*)?@)?(?:(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\\.(?:[a-z\u00a1-\uffff]{2,}))\\.?)(?::\\d{2,5})?(?:[/?#]\\S*)?$',
            'i'
        );
        return !value.length ? null : urlRegex.test(value) ? null : err;
    };
}
