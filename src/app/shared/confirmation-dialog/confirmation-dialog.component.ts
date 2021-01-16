import {Component, Input, OnInit, TemplateRef, ViewChild, ChangeDetectorRef} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NgForm} from '@angular/forms';

@Component({
    selector: 'app-confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {
    @ViewChild('deleteForm') deleteForm: NgForm;
    @Input() title: string;
    @Input() template: TemplateRef<any>;
    @Input() row;
    @Input() withForm = false;
    @Input() pattern = 'DELETE';
    control: string;

    constructor(
        public activeModal: NgbActiveModal,
        private changeDetector: ChangeDetectorRef
    ) {
    }

    ngOnInit(): void {
        this.changeDetector.detectChanges();
    }

}
