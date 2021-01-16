import {OnDestroy} from '@angular/core';
import {SubSink} from 'subsink';

export default class BaseComponentClass implements OnDestroy {
    protected subscriptions: SubSink = new SubSink();

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
