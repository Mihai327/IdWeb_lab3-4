import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'imageFilePipe'})
export class ImageFilePipe implements PipeTransform {
    transform(value: File): string {
        return URL.createObjectURL(value);
    }
}
