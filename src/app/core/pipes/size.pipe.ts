import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'fileSize'})
export class SizePipe implements PipeTransform {
    transform(value: File): string {
        return this.bytesToSize(value);
    }

    private bytesToSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) {
            return '0 Byte';
        }
        const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))), 10);
        return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
    }
}
