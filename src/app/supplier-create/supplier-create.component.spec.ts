/**
 * Author: John Kuronya
 * Date: 16 December 2025
 * File: supplier-create.component.spec.ts
 * Description: Unit tests for SupplierCreateComponent.
 */

import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { SupplierCreateComponent } from './supplier-create.component';
import { environment } from '../../environments/environment';

describe('SupplierCreateComponent', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierCreateComponent, HttpClientTestingModule],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  /**
   * 1. Should not submit when form is invalid
   */
  it('should not submit when form is invalid', () => {
    const fixture = TestBed.createComponent(SupplierCreateComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    // All fields empty => invalid form
    component.onSubmit();

    // No HTTP call should be made
    httpMock.expectNone(() => true);

    expect(component.successMessage).toBe('');
    expect(component.errorMessage).toBe('');
  });

  /**
   * 2. Should call API and show success message on successful creation
   */
  it('should call API and show success message on success', () => {
    const fixture = TestBed.createComponent(SupplierCreateComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    const supplierData = {
      supplierId: 100,
      supplierName: 'Tech Supplier',
      contactInformation: '133-456-7890',
      address: '123 Apple Ave',
    };

    component.supplierForm.setValue(supplierData);

    component.onSubmit();

    const req = httpMock.expectOne(
      `${environment.apiBaseUrl}/api/supplier`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(supplierData);

    req.flush({ ...supplierData, _id: 'someid' });

    expect(component.isSubmitting).toBeFalse();
    expect(component.errorMessage).toBe('');
    expect(component.successMessage).toBe('Supplier created successfully.');
  });

  /**
   * 3. Should show error message when API call fails
   */
  it('should show error message when API call fails', () => {
    const fixture = TestBed.createComponent(SupplierCreateComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    const supplierData = {
      supplierId: 101,
      supplierName: 'Another Supplier',
      contactInformation: '555-123-4567',
      address: '456 Elm St',
    };

    component.supplierForm.setValue(supplierData);

    component.onSubmit();

    const req = httpMock.expectOne(
      `${environment.apiBaseUrl}/api/supplier`
    );
    expect(req.request.method).toBe('POST');

    req.flush(
      { message: 'Something went wrong' },
      { status: 500, statusText: 'Server Error' }
    );

    expect(component.isSubmitting).toBeFalse();
    expect(component.successMessage).toBe('');
    expect(component.errorMessage).toBe(
      'Failed to create supplier. Please try again.'
    );
  });
});
