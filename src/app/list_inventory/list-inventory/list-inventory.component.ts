import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-list-inventory',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Inventory Items</h1>

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
            <th>Quantity</th>
            <th>Price</th>
            <th>Category ID</th>
            <th>Supplier ID</th>
          </tr>
        </thead>

        <tbody>
          @for (item of items; track item._id) {
            <tr>
              <td>{{ item.name }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.price | currency }}</td>
              <td>{{ item.category_id }}</td>
              <td>{{ item.supplier_id }}</td>
            </tr>
          }
        </tbody>
      </table>
    }
  `,
  styles: `
    h1 {
      margin-bottom: 20px;
    }
    .error {
      color: red;
      font-weight: bold;
    }
    .table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    .table th, .table td {
      border: 1px solid #ccc;
      padding: 8px;
    }
    .table th {
      background-color: #f4f4f4;
    }
  `
})
export class ListInventoryComponent implements OnInit {

  items: any[] = [];
  loading = true;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>(`${environment.apiBaseUrl}/api/inventory`).subscribe({
      next: (data) => {
        this.items = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load inventory items.';
        this.loading = false;
      }
    });
  }
}
