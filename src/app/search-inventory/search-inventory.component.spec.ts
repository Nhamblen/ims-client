/**
 * Author: Noah Hamblen
 * Date: 10 December 2025
 * File: search-inventory.component.spec.ts
 * Description: Unit tests for the SearchInventory.
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SearchInventoryComponent } from './search-inventory.component';
import { environment } from '../../environments/environment';
import { RouterTestingModule } from '@angular/router/testing';

describe('SearchInventoryComponent', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchInventoryComponent, HttpClientTestingModule]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  // Test 1: Component should create
  it('should create component', () => {
    const fixture = TestBed.createComponent(SearchInventoryComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  // Test 2: Should call API on search()
  it('should call API when searching', () => {
    const fixture = TestBed.createComponent(SearchInventoryComponent);
    const component = fixture.componentInstance;

    component.query = 'lap';
    component.search();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/inventory/search?name=lap`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  // Test 3: Should store results
  it('should store returned items', () => {
    const fixture = TestBed.createComponent(SearchInventoryComponent);
    const component = fixture.componentInstance;

    component.query = 'lap';
    component.search();

    const mock = [{ name: 'Laptop', quantity: 10 }];
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/inventory/search?name=lap`);
    req.flush(mock);

    expect(component.results.length).toBe(1);
    expect(component.results[0].name).toBe('Laptop');
  });

  afterEach(() => httpMock.verify());
});
