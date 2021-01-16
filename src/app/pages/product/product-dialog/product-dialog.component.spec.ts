import { HttpClientModule, HttpHandler } from '@angular/common/http';
import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ApiService, AuthService, TokenService, UtilService } from '@app/core';
import ProductService from '@app/core/services/rest/product.service';
import ShipService from '@app/core/services/rest/ship.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import {of} from 'rxjs'

import {ProductDialogComponent} from './product-dialog.component';

describe('ProductDialogComponent', () => {
    let component: ProductDialogComponent;
    let fixture: ComponentFixture<ProductDialogComponent>;
    let productService: ProductService;
    const formData = {
        name: 'Create Product Test',
        ship_id: 19,
        build_number: 1000,
        build_year: 1999,
        category: '1',
        type: 'test',
        image: '/storage/product/9/01-bora-bora-insel.jpg',
        weight: 12,
        length_in: 12,
        length_out: 12,
        ship: {
            name: 'test jan MTS'
        }
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ProductDialogComponent],
            imports: [HttpClientModule, 
                RouterTestingModule, 
                ToastrModule.forRoot()
            ],
            providers: [NgbActiveModal, 
                ShipService, 
                FormBuilder, 
                UtilService, 
                ProductService, 
                ToastrService, 
                ApiService, 
                AuthService, 
                TokenService]
            
        })
            .compileComponents();
    }));

    beforeEach(inject([ProductService], ps => {
        productService = ps;
        fixture = TestBed.createComponent(ProductDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        component.product = <any>formData;
        component.ngOnInit();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should to build the form', () => {
        expect(component.form).not.toBeUndefined('Build form fail!');
    });

    it('should to create a new product', async () => {
        component.editMode = false;
        const response = true;

        spyOn(productService, 'createProduct').and.returnValue(of(response));

        component.onSubmit();
        fixture.detectChanges();

        expect(component.success).toEqual(response);
    });
});
