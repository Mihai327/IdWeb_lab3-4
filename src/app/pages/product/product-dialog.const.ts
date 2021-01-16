import {FormBuilder, FormGroup, Validators} from '@angular/forms';

const formBuilder = new FormBuilder();

export const categoryCrane: FormGroup = formBuilder.group({
    weight: ['', {validators: [Validators.required], updateOn: 'blur'}],
    length_in: ['', {validators: [Validators.required], updateOn: 'blur'}],
    length_out: ['', {validators: [Validators.required], updateOn: 'blur'}],
});
export const categorySpudPole: FormGroup = formBuilder.group({
    power: ['', {validators: [Validators.required], updateOn: 'blur'}],
    oil_pressure: ['', {validators: [Validators.required], updateOn: 'blur'}],
    length_extended: [
        '',
        {validators: [Validators.required], updateOn: 'blur'},
    ],
    chain_type: ['', {validators: [Validators.required], updateOn: 'blur'}],
});

export const categoryOptions: any[] = [
    {id: '1', name: 'Crane'},
    {id: '2', name: 'Spud pole'}
];
