import {InjectionToken} from '@angular/core';

export const WINDOW = new InjectionToken<Window>('WindowToken');

export function windowFactory(): Window {
    return window;
}
