import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ListSupplierComponent } from './list-supplier.component';
import { environment } from '../../environments/environment';

describe('ListSuppliersComponent', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListSupplierComponent, HttpClientTestingModule]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ListSupplierComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should call GET /api/supplier', () => {
    const fixture = TestBed.createComponent(ListSupplierComponent);
    fixture.detectChanges();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/supplier`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should load suppliers', () => {
    const fixture = TestBed.createComponent(ListSupplierComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/supplier`);
    req.flush([{ supplierName: 'Tech Supplier', supplierId: 100 }]);

    expect(component.suppliers.length).toBe(1);
  });

  afterEach(() => httpMock.verify());
});
