import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

/**
 * List Inventory Component
 * Displays all inventory items retrieved from the API.
 */

@Component({
  selector: 'app-list-inventory',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Inventory Items</h1>

    <!-- Display while data is loading -->
    @if (loading) {
      <p>Loading...</p>
    }

    <!-- Display if an error occurs -->
    @if (errorMessage) {
      <p class="error">{{ errorMessage }}</p>
    }

    <!-- Display table only after data is loaded -->
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
          <!-- Loop through each inventory item -->
          @for (item of items; track item._id) {
            <tr>
              <td>{{ item.name }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.price | currency }}</td>
              <td>{{ item.categoryId }}</td>
              <td>{{ item.supplierId }}</td>
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

  // Holds the inventory items returned from the API
  items: any[] = [];

  loading = true;

  // Stores any error message from the API call
  errorMessage = '';

  constructor(private http: HttpClient) {}

  /**
  * Method that runs once when the component loads.
  * Makes an HTTP GET request to fetch inventory data.
  */

  ngOnInit(): void {
    this.http.get<any[]>(`${environment.apiBaseUrl}/api/inventory`).subscribe({
      next: (data) => {
        this.items = data; // Save returned items
        this.loading = false; // Stop loading indicator
      },
      error: () => {
        this.errorMessage = 'Failed to load inventory items.'; // Display error
        this.loading = false;
      }
    });
  }
}
