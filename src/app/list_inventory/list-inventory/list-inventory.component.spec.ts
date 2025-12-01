import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ListInventoryComponent } from './list-inventory.component';
import { environment } from '../../../environments/environment';

/**
 * List Inventory Tests
 * Confirms component displays all inventory items retrieved from the API.
 */

describe('ListInventoryComponent (no service)', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    // Configure the testing module and load the component + Http testing module
    await TestBed.configureTestingModule({
      imports: [ListInventoryComponent, HttpClientTestingModule]
    }).compileComponents();

    // Set up the mock HTTP controller so we can intercept API calls
    httpMock = TestBed.inject(HttpTestingController);
  });

  // Test 1: Component should create without errors
  it('should create the component', () => {
    const fixture = TestBed.createComponent(ListInventoryComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  // Test 2: Confirms component makes GET request to /api/inventory
  it('should call GET /api/inventory', () => {
    const fixture = TestBed.createComponent(ListInventoryComponent);
    fixture.detectChanges();

    // Verify the request URL and HTTP verb
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/inventory`);
    expect(req.request.method).toBe('GET');

    // Respond with an empty array so the request completes
    req.flush([]);
  });

  // Test 3: Ensures that when API returns data, component correctly stores item in array
  it('should load items into the component', () => {
    const fixture = TestBed.createComponent(ListInventoryComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    // Sample item returned from the API
    const mockItems = [{
      name: 'Laptop',
      quantity: 10,
      price: 999,
      categoryId: 1000,
      supplierId: 1
    }];

    // Expect the same GET call as before
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/inventory`);

    // Provide the mock data
    req.flush(mockItems);

    expect(component.items.length).toBe(1);
    expect(component.items[0].name).toBe('Laptop');
  });

  // After each test, verify no unexpected HTTP requests were made.
  afterEach(() => {
    httpMock.verify();
  });
});
