/**
 * Author: John Kuronya
 * Date: 7 December 2025
 * File: inventory-item-by-id.component.spec.ts
 * Description: Unit tests for InventoryItemByIdComponent.
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { InventoryItemByIdComponent } from './inventory-item-by-id.component';
import { environment } from '../../../environments/environment';

describe('InventoryItemByIdComponent', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryItemByIdComponent, HttpClientTestingModule, ReactiveFormsModule],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  /**
   * 1. Should create and NOT call API before submit
   */
  it('should create and not call API before submit', () => {
    const fixture = TestBed.createComponent(InventoryItemByIdComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    // No outstanding HTTP calls yet
    httpMock.expectNone(() => true);
    expect(component).toBeTruthy();
    expect(component.item).toBeNull();
    expect(component.errorMessage).toBe('');
  });

  /**
   * 2. Should call API and set item on successful load
   */
  it('should call API and set item on successful load', () => {
    const fixture = TestBed.createComponent(InventoryItemByIdComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    // Set a valid ID in the form
    const testId = '507f1f77bcf86cd799439011';
    component.idForm.setValue({ id: testId });

    component.onSubmit();

    const req = httpMock.expectOne(
      `${environment.apiBaseUrl}/api/inventory/${testId}`
    );
    expect(req.request.method).toBe('GET');

    // Mock successful response
    req.flush({
      _id: testId,
      categoryId: 1,
      supplierId: 2,
      name: 'Test Item',
      description: 'Test description',
      quantity: 10,
      price: 9.99,
    });

    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toBe('');
    expect(component.item).toEqual(
      jasmine.objectContaining({
        _id: testId,
        name: 'Test Item',
        quantity: 10,
        price: 9.99,
      })
    );
  });

  /**
   * 3. Should set errorMessage on 404 error
   */
  it('should set errorMessage when API returns 404', () => {
    const fixture = TestBed.createComponent(InventoryItemByIdComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    const testId = '507f1f77bcf86cd799439022';
    component.idForm.setValue({ id: testId });

    component.onSubmit();

    const req = httpMock.expectOne(
      `${environment.apiBaseUrl}/api/inventory/${testId}`
    );
    expect(req.request.method).toBe('GET');

    // Mock 404 response
    req.flush(
      { message: 'Inventory item not found' },
      { status: 404, statusText: 'Not Found' }
    );

    expect(component.isLoading).toBeFalse();
    expect(component.item).toBeNull();
    expect(component.errorMessage).toBe('Inventory item not found.');
  });
});
