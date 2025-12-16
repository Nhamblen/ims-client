/**
 * Author: John Kuronya
 * Date: 30 November 2025
 * File: inventory-item.component.spec.ts
 * Description: Unit tests for the InventoryItemComponent.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventoryItemComponent } from './inventory-item.component';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from '../../environments/environment';

describe('InventoryItemComponent', () => {
  let component: InventoryItemComponent;
  let fixture: ComponentFixture<InventoryItemComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryItemComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryItemComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  // TEST 1: Component should be created
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TEST 2: Form should be invalid when required fields are empty
  it('should have an invalid form when required fields are empty', () => {
    component.inventoryForm.reset();

    expect(component.inventoryForm.invalid).toBeTrue();
    expect(component.f['name'].hasError('required')).toBeTrue();
    expect(component.f['categoryId'].hasError('required')).toBeTrue();
    expect(component.f['supplierId'].hasError('required')).toBeTrue();
  });

  // TEST 3: Should send POST request when form is valid and handle success
  it('should send POST request and set success message when form is valid', () => {
    const fixture = TestBed.createComponent(InventoryItemComponent);
    const component = fixture.componentInstance;

    // Fill out the form with valid data
    component.inventoryForm.setValue({
      categoryId: 1,
      supplierId: 100,
      name: 'Test Item',
      description: 'Test description',
      quantity: 5,
      price: 10.99
    });

    // Submit the form
    component.onSubmit();

    // Expect POST request
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/inventory`);
    expect(req.request.method).toBe('POST');

    // Simulate successful response
    req.flush({});

    // Assertions
    expect(component.successMessage).toBe('Inventory item created successfully.');
    expect(component.isSubmitting).toBeFalse();
  });

  afterEach(() => {
    httpMock.verify();
  });
  });
