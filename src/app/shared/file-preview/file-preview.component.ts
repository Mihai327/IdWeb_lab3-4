import {Component, Input, OnInit} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-file-preview',
    templateUrl: './file-preview.component.html',
    styleUrls: ['./file-preview.component.scss']
})
export class FilePreviewComponent implements OnInit {
    @Input() file: any;
    @Input() width: number;
    fileUrl;

    constructor(
        private sanitizer: DomSanitizer
    ) {}

    ngOnInit(): void {
        if (!this.file.fileUrl) {
            const reader = new FileReader();
            reader.onload = (event: any) => {
                this.fileUrl = this.sanitizer.bypassSecurityTrustUrl(event.target.result);
            };

            reader.onerror = (event: any) => {
                console.log('File could not be read: ' + event.target.error.code);
            };
            reader.readAsDataURL(this.file);
        } else {
            this.fileUrl = this.file.fileUrl;
        }
    }

}
