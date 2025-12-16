import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-list-suppliers',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Suppliers</h1>

    @if (loading) {
      <p>Loading...</p>
    }

    @if (errorMessage) {
      <p class="error">{{ errorMessage }}</p>
    }

    @if (!loading && !errorMessage) {
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Supplier ID</th>
            <th>Contact</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          @for (supplier of suppliers; track supplier._id) {
            <tr>
              <td>{{ supplier.supplierName }}</td>
              <td>{{ supplier.supplierId }}</td>
              <td>{{ supplier.contactInformation }}</td>
              <td>{{ supplier.address }}</td>
            </tr>
          }
        </tbody>
      </table>
    }
  `,
  styles: `
    .error { color: red; }
    .table { width: 100%; border-collapse: collapse; }
    .table th, .table td { border: 1px solid #ccc; padding: 8px; }
  `
})
export class ListSupplierComponent implements OnInit {
  suppliers: any[] = [];
  loading = true;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>(`${environment.apiBaseUrl}/api/supplier`)
      .subscribe({
        next: data => {
          this.suppliers = data;
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'Failed to load suppliers.';
          this.loading = false;
        }
      });
  }
}
