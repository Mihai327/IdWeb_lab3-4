import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'skeleton-table',
    templateUrl: './skeleton-table.component.html',
    styleUrls: ['skeleton-table.component.scss']
})
export class SkeletonTableComponent implements OnInit {
    theme = {
        height: '20px',
        margin: '0px',
        display: 'block'
    };

    constructor() {
    }

    ngOnInit(): void {
    }

}
