import {Component, OnInit, Input, TemplateRef} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-inline-modal',
    templateUrl: './inline-modal.component.html',
    styleUrls: ['./inline-modal.component.scss']
})
export class InlineModalComponent implements OnInit {
    @Input() params: {
        title: string,
        leftBtn: string,
        rightBtn: string,
        template: TemplateRef<any>,
        row: any
    };

    constructor(
        public activeModal: NgbActiveModal
    ) {
    }

    ngOnInit(): void {
    }

}
