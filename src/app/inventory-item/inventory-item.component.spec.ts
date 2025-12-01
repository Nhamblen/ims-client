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
    // Arrange: set valid form values
    component.inventoryForm.setValue({
      categoryId: 1,
      supplierId: 100,
      name: 'Test Item From Component',
      description: 'A test item created from the component',
      quantity: 10,
      price: 9.99,
    });

    // Act: submit the form
    component.onSubmit();

    // Assert: HTTP request was sent
    const req = httpMock.expectOne('/api/inventory');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.name).toBe('Test Item From Component');

    // Simulate a successful response from the backend
    req.flush({
      _id: '123',
      ...req.request.body,
    });

    // After success
    expect(component.isSubmitting).toBeFalse();
    expect(component.successMessage).toContain('created successfully');
    expect(component.errorMessage).toBe('');
  });
});
