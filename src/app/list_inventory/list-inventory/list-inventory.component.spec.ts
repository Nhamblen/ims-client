import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ListInventoryComponent } from './list-inventory.component';
import { environment } from '../../../environments/environment';

describe('ListInventoryComponent (no service)', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListInventoryComponent, HttpClientTestingModule]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  // TEST 1: Component should create
  it('should create the component', () => {
    const fixture = TestBed.createComponent(ListInventoryComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  // TEST 2: API call should hit the correct endpoint
  it('should call GET /api/inventory', () => {
    const fixture = TestBed.createComponent(ListInventoryComponent);
    fixture.detectChanges();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/inventory`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  // TEST 3: Should load items into the table
  it('should load items into the component', () => {
    const fixture = TestBed.createComponent(ListInventoryComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const mockItems = [{
      name: 'Laptop',
      quantity: 10,
      price: 999,
      categoryId: 1000,
      supplierId: 1
    }];

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/inventory`);
    req.flush(mockItems);

    expect(component.items.length).toBe(1);
    expect(component.items[0].name).toBe('Laptop');
  });

  afterEach(() => {
    httpMock.verify();
  });
});
