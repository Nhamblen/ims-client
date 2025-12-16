/**
 * Author: John Kuronya
 * Date: 7 December 2025
 * File: inventory-item-by-id.component.spec.ts
 * Description: Unit tests for InventoryItemByIdComponent.
 */

import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { InventoryItemByIdComponent } from './inventory-item-by-id.component';
import { environment } from '../../../environments/environment';

describe('InventoryItemByIdComponent', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryItemByIdComponent, HttpClientTestingModule],
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
    const fixture = TestBed.createComponent(InventoryItemByIdComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    // Form starts with empty searchValue, so invalid
    component.onSubmit();

    // No HTTP requests should be made
    httpMock.expectNone(() => true);

    expect(component.errorMessage).toBe('');
    expect(component.item).toBeNull();
    expect(component.items.length).toBe(0);
  });

  /**
   * 2. Should call /api/inventory/:id and show single item when searching by ID
   */
  it('should call API by ID and set item on success', () => {
    const fixture = TestBed.createComponent(InventoryItemByIdComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    component.idForm.setValue({
      searchType: 'id',
      searchValue: 'abc123id',
    });

    component.onSubmit();

    const req = httpMock.expectOne(
      `${environment.apiBaseUrl}/api/inventory/abc123id`
    );
    expect(req.request.method).toBe('GET');

    const mockItem = {
      _id: 'abc123id',
      categoryId: 1,
      supplierId: 100,
      name: 'Test Item',
      description: 'Desc',
      quantity: 5,
      price: 9.99,
    };

    req.flush(mockItem);

    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toBe('');
    expect(component.item).toEqual(mockItem as any);
    expect(component.items.length).toBe(1);
  });

  /**
   * 3. Should call search endpoint and show multiple items when searching by Category ID
   */
  it('should call search API by Category ID and set items on success', () => {
    const fixture = TestBed.createComponent(InventoryItemByIdComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    component.idForm.setValue({
      searchType: 'categoryId',
      searchValue: '1',
    });

    component.onSubmit();

    const req = httpMock.expectOne(
      (request) =>
        request.url === `${environment.apiBaseUrl}/api/inventory/search` &&
        request.params.get('categoryId') === '1'
    );
    expect(req.request.method).toBe('GET');

    const mockItems = [
      {
        _id: 'id1',
        categoryId: 1,
        supplierId: 100,
        name: 'Category Item 1',
        description: 'First',
        quantity: 10,
        price: 19.99,
      },
      {
        _id: 'id2',
        categoryId: 1,
        supplierId: 101,
        name: 'Category Item 2',
        description: 'Second',
        quantity: 3,
        price: 29.99,
      },
    ];

    req.flush(mockItems);

    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toBe('');
    expect(component.item).toBeNull(); // multiple results → table view
    expect(component.items.length).toBe(2);
  });
});
