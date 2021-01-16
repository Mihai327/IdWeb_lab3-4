import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {saveAs} from 'file-saver';
import DocumentService from '@app/core/services/rest/document.service';

@Component({
    selector: 'app-document-viewer-modal',
    templateUrl: './document-viewer-modal.component.html',
    styleUrls: ['./document-viewer-modal.component.scss'],
})
export class DocumentViewerModalComponent implements OnInit {
    @Input() type: string;
    @Input() file: any;

    constructor(
        public sanitizer: DomSanitizer,
        public activeModal: NgbActiveModal,
        private documentService: DocumentService
    ) {}

    ngOnInit(): void {
    }

    onSaveFile() {
        this.documentService.getDocument({file: this.file.name}).subscribe((data: Blob) => {
            saveAs(data);
        });
    }
}
