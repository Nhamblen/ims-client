import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InventoryUpdateComponent } from './inventory-update.component';
import { environment } from '../../environments/environment';

describe('InventoryUpdateComponent', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryUpdateComponent, HttpClientTestingModule]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

    // Test 1: Component should render successfully
  it('should create', () => {
    const fixture = TestBed.createComponent(InventoryUpdateComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });


  // Test 2: Component should make a GET request and load items
  it('should load items on init', () => {
    const fixture = TestBed.createComponent(InventoryUpdateComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    // Expect one GET request to the inventory API
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/inventory`);
    expect(req.request.method).toBe('GET');

    // Respond with mock data
    req.flush([{ name: 'Laptop', quantity: 5 }]);

    // Verify component updated correctly
    expect(component.items.length).toBe(1);
    expect(component.loading).toBeFalse();
  });

  // Test 3: updateItem() should send a PUT request with the updated item
  it('should send PUT when updateItem is called', () => {
    const fixture = TestBed.createComponent(InventoryUpdateComponent);
    const component = fixture.componentInstance;

    const item = { _id: '123', name: 'Keyboard', quantity: 10 };

    // Call the method under test
    component.updateItem(item);

     // Expect a PUT request to the correct URL with item as body
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/inventory/123`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(item);

    req.flush({});
  });

  // Ensures no pending HTTP requests remain after each test
  afterEach(() => {
    httpMock.verify();
  });
});
