/**
 * Author: John Kuronya
 * Date: 8 December 2025
 * File: delete-inventory-item.component.spec.ts
 * Description: Unit tests for DeleteInventoryItemComponent.
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DeleteInventoryItemComponent } from './delete-inventory-item.component';
import { environment } from '../../../environments/environment';

describe('DeleteInventoryItemComponent', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteInventoryItemComponent, HttpClientTestingModule],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  /**
   * Should not call API when form is invalid and should show required message
   */
  it('should not call API when form is invalid and should show required message', () => {
    const fixture = TestBed.createComponent(DeleteInventoryItemComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    // form is invalid because id is empty
    component.onSubmit();

    // no HTTP calls should have been made
    httpMock.expectNone(() => true);

    expect(component.errorMessage).toBe('Inventory ID is required.');
    expect(component.successMessage).toBe('');
  });

  /**
   * Should call DELETE API and show success message on valid delete
   */
  it('should call DELETE API and show success message on successful delete', () => {
    const fixture = TestBed.createComponent(DeleteInventoryItemComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    const testId = '693501f94a5986e245fce161';
    component.deleteForm.setValue({ id: testId });

    component.onSubmit();

    const req = httpMock.expectOne(
      `${environment.apiBaseUrl}/api/inventory/${testId}`
    );
    expect(req.request.method).toBe('DELETE');

    // mock success response
    req.flush({
      message: 'Inventory item deleted successfully',
      id: testId,
    });

    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toBe('');
    expect(component.successMessage).toBe('Inventory item deleted successfully');
  });

  /**
   * Should show "not found" error message when API returns 404
   */
  it('should show not found error message when API returns 404', () => {
    const fixture = TestBed.createComponent(DeleteInventoryItemComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    const testId = '693501f94a5986e245fce162';
    component.deleteForm.setValue({ id: testId });

    component.onSubmit();

    const req = httpMock.expectOne(
      `${environment.apiBaseUrl}/api/inventory/${testId}`
    );
    expect(req.request.method).toBe('DELETE');

    // mock 404 response
    req.flush(
      { message: 'Inventory item not found' },
      { status: 404, statusText: 'Not Found' }
    );

    expect(component.isLoading).toBeFalse();
    expect(component.successMessage).toBe('');
    expect(component.errorMessage).toBe('Inventory item not found.');
  });
});
