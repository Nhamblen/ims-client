/**
 * Author: Noah Hamblen
 * Date: 10 December 2025
 * File: search-inventory.component.ts
 * Description: Component for the SearchInventory.
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h1>Search Inventory</h1>

    <!-- Search type dropdown -->
    <label>
      Search By:
      <select [(ngModel)]="searchType">
        <option value="name">Name</option>
        <option value="categoryId">Category ID</option>
        <option value="supplierId">Supplier ID</option>
      </select>
    </label>

    <!-- Input -->
    <input
      type="text"
      [(ngModel)]="query"
      placeholder="Enter search value..."
    />

    <button (click)="search()">Search</button>

    @if (loading) {
      <p>Loading...</p>
    }

    @if (errorMessage) {
      <p class="error">{{ errorMessage }}</p>
    }

    @if (!loading && results.length > 0) {
      <ul>
        @for (item of results; track item._id) {
          <li>
            {{ item.name }} - Qty: {{ item.quantity }} - Category ID: {{ item.categoryId }} - Supplier ID: {{ item.supplierId }}
          </li>
        }
      </ul>
    }
  `,
  styles: `
    input { margin: 10px 10px 0 10px; padding: 5px; }
    select { margin-right: 10px; padding: 5px; }
    .error { color: red; }
  `
})
export class SearchInventoryComponent {
  searchType = 'name';  // default
  query = '';
  results: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  search() {
    if (!this.query.trim()) {
      this.errorMessage = "Please enter a search term.";
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const url = `${environment.apiBaseUrl}/api/inventory/search?${this.searchType}=${this.query}`;

    this.http.get<any[]>(url).subscribe({
      next: data => {
        this.results = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Search failed.';
        this.loading = false;
      }
    });
  }
}
