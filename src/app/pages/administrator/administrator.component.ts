import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ActivationEnd, ChildActivationEnd, NavigationEnd, Router, RouterEvent} from '@angular/router';
import BaseComponentClass from '@app/core/class/BaseComponent.class';

@Component({
    selector: 'app-administrator',
    templateUrl: './administrator.component.html',
    styleUrls: ['./administrator.component.scss']
})
export class AdministratorComponent extends BaseComponentClass implements OnInit {
    tabs = [
        {title: 'Bedrijven', link: '/administrator/company', ref: 'company'},
        {title: 'Gebruiker', link: '/administrator/user', ref: 'user'},
        {title: 'Schepen', link: '/administrator/ships', ref: 'ships'},
        {title: 'Producten', link: '/administrator/products', ref: 'products'}
    ];

    activatedTab;

    constructor(
        private activatedRoute: ActivatedRoute) {
        super();
    }

    ngOnInit(): void {
        this.activatedTab = this.activatedRoute.snapshot.firstChild.data.tab;
    }

}
