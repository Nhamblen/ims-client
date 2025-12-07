import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-inventory-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h1>Inventory Items</h1>

    <!-- Loading -->
    @if (loading) {
      <p>Loading...</p>
    }

    <!-- Error -->
    @if (errorMessage) {
      <p class="error">{{ errorMessage }}</p>
    }

    <!-- Table -->
    @if (!loading && !errorMessage) {
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Category ID</th>
            <th>Supplier ID</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          @for (item of items; track item._id) {
            <tr>
              <td>{{ item.name }}</td>

              <!-- Editable Quantity -->
              <td>
                <input type="number"
                       [(ngModel)]="item.quantity"
                       name="qty-{{item._id}}">
              </td>

              <!-- Editable Price -->
              <td>
                <input type="number"
                       step="0.01"
                       [(ngModel)]="item.price"
                       name="price-{{item._id}}">
              </td>

              <td>{{ item.categoryId }}</td>
              <td>{{ item.supplierId }}</td>

              <!-- Update Button -->
              <td>
                <button (click)="updateItem(item)">Update</button>
              </td>
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
    input {
      width: 80px;
      padding: 4px;
    }
    button {
      padding: 4px 8px;
      cursor: pointer;
    }
  `
})
export class InventoryUpdateComponent implements OnInit {

  // Holds all inventory items retrieved from the API.
  items: any[] = [];
  loading = true;
  errorMessage = '';
  successMessage = '';

  constructor(private http: HttpClient) {}

    /**
   * ngOnInit()
   * Runs once when the component loads.
   * Makes an HTTP GET request to fetch all inventory items so they can be displayed and edited.
   */
  ngOnInit(): void {
    this.http.get<any[]>(`${environment.apiBaseUrl}/api/inventory`).subscribe({
      next: (data) => {
        this.items = data; // Save the retrieved items
        this.loading = false; // Stop the loading spinner
      },
      error: () => {
        this.errorMessage = 'Failed to load inventory items.'; // Show error message in UI
        this.loading = false;
      }
    });
  }

  /**
   * updateItem()
   * Sends a PUT request to update a specific inventory item.
   * Only the fields edited in the table (such as quantity or price) are sent back.
   */
  updateItem(item: any): void {
    this.http.put(`${environment.apiBaseUrl}/api/inventory/${item._id}`, item)
      .subscribe({
        next: () => alert('Item updated successfully!'),
        error: () => alert('Failed to update item.')
      });
  }
}
