import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SharedTypeaheadComponent} from './shared-typeahead.component';

describe('SharedTypeaheadComponent', () => {
    let component: SharedTypeaheadComponent;
    let fixture: ComponentFixture<SharedTypeaheadComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SharedTypeaheadComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SharedTypeaheadComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
