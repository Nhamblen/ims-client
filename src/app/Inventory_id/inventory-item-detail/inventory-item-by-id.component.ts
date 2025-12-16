/**
 * Author: John Kuronya
 * Date: 7 December 2025
 * File: inventory-item-by-id.component.ts
 * Description: Standalone component to read an inventory item by ID or Category ID.
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface InventoryItem {
  _id: string;
  categoryId: number;
  supplierId: number;
  name: string;
  description?: string;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-inventory-item-by-id',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2>Inventory Item Lookup</h2>

    <form [formGroup]="idForm" (ngSubmit)="onSubmit()">
      <div class="form-row">
        <label for="searchType">Search by</label>
        <select id="searchType" formControlName="searchType">
          <option value="id">Inventory ID</option>
          <option value="categoryId">Category ID</option>
        </select>
      </div>

      <div class="form-row">
        <label for="searchValue">
          {{ idForm.value.searchType === 'categoryId'
            ? 'Category ID'
            : 'Inventory ID' }}
        </label>
        <input
          id="searchValue"
          type="text"
          formControlName="searchValue"
          [placeholder]="
            idForm.value.searchType === 'categoryId'
              ? 'Enter Category ID (e.g. 1)'
              : 'Enter inventory _id'
          "
        />

        <div *ngIf="f['searchValue'].touched && f['searchValue'].invalid" class="error">
          <small *ngIf="f['searchValue'].errors?.['required']">
            A value is required.
          </small>
        </div>
      </div>

      <button type="submit" [disabled]="isLoading || idForm.invalid">
        {{ isLoading ? 'Loading...' : 'Load Item(s)' }}
      </button>
    </form>

    <!-- Error message -->
    <p *ngIf="errorMessage" class="error">
      {{ errorMessage }}
    </p>

    <!-- Single item card (when exactly one result) -->
    <div *ngIf="item && !errorMessage" class="card">
      <p><strong>ID:</strong> {{ item._id }}</p>
      <p><strong>Name:</strong> {{ item.name }}</p>
      <p><strong>Description:</strong> {{ item.description || 'N/A' }}</p>
      <p><strong>Category ID:</strong> {{ item.categoryId }}</p>
      <p><strong>Supplier ID:</strong> {{ item.supplierId }}</p>
      <p><strong>Quantity:</strong> {{ item.quantity }}</p>
      <p><strong>Price:</strong> {{ item.price | currency }}</p>
    </div>

    <!-- Table view when multiple items are returned (category search) -->
    <div *ngIf="items.length > 1 && !errorMessage" class="results">
      <h3>{{ items.length }} items found</h3>
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Category ID</th>
            <th>Supplier ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let i of items">
            <td>{{ i._id }}</td>
            <td>{{ i.categoryId }}</td>
            <td>{{ i.supplierId }}</td>
            <td>{{ i.name }}</td>
            <td>{{ i.description || 'N/A' }}</td>
            <td>{{ i.quantity }}</td>
            <td>{{ i.price | currency }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [
    `
      h2 {
        margin-bottom: 1rem;
      }

      form {
        max-width: 400px;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-bottom: 1rem;
      }

      .form-row {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      label {
        font-weight: 600;
      }

      input,
      select {
        padding: 0.25rem 0.5rem;
        box-sizing: border-box;
        width: 100%;
      }

      button {
        align-self: flex-start;
        padding: 0.4rem 0.8rem;
        cursor: pointer;
      }

      .error {
        color: #b00020;
        font-size: 0.85rem;
        margin-top: 0.25rem;
      }

      .card {
        border: 1px solid #ccc;
        padding: 1rem;
        border-radius: 4px;
        max-width: 400px;
        margin-top: 0.5rem;
      }

      .results {
        margin-top: 1rem;
      }

      .table {
        width: 100%;
        border-collapse: collapse;
      }

      .table th,
      .table td {
        border: 1px solid #d1d5db;
        padding: 0.4rem;
        font-size: 0.9rem;
      }

      .table th {
        background-color: #f3f4f6;
        text-align: left;
      }
    `,
  ],
})
export class InventoryItemByIdComponent {
  idForm: FormGroup;
  item: InventoryItem | null = null;
  items: InventoryItem[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.idForm = this.fb.group({
      searchType: ['id', Validators.required], // 'id' or 'categoryId'
      searchValue: ['', Validators.required],
    });
  }

  get f() {
    return this.idForm.controls;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.item = null;
    this.items = [];

    if (this.idForm.invalid) {
      this.idForm.markAllAsTouched();
      return;
    }

    const searchType = this.idForm.value.searchType as 'id' | 'categoryId';
    const rawValue = (this.idForm.value.searchValue as string).trim();

    if (!rawValue) {
      this.errorMessage = 'A value is required.';
      return;
    }

    this.isLoading = true;

    if (searchType === 'id') {
      // 🔍 Use existing read-by-id API: GET /api/inventory/:id
      this.http
        .get<InventoryItem>(
          `${environment.apiBaseUrl}/api/inventory/${rawValue}`
        )
        .subscribe({
          next: (data) => {
            this.item = data;
            this.items = [data];
            this.isLoading = false;
          },
          error: (err) => {
            this.isLoading = false;
            if (err.status === 404) {
              this.errorMessage = 'Inventory item not found.';
            } else if (err.status === 400) {
              this.errorMessage = 'Invalid inventory ID.';
            } else {
              this.errorMessage = 'Failed to load inventory item.';
            }
          },
        });
    } else {
      // 🔍 Search by categoryId using your search_inventory route:
      // GET /api/inventory/search?categoryId=...
      this.http
        .get<InventoryItem[]>(
          `${environment.apiBaseUrl}/api/inventory/search`,
          {
            params: { categoryId: rawValue },
          }
        )
        .subscribe({
          next: (data) => {
            this.isLoading = false;
            this.items = Array.isArray(data) ? data : [];

            if (this.items.length === 0) {
              this.errorMessage =
                'No inventory items found for that Category ID.';
              return;
            }

            // If exactly one result, also show it in the card view
            this.item = this.items.length === 1 ? this.items[0] : null;
          },
          error: (err) => {
            this.isLoading = false;
            if (err.status === 400) {
              this.errorMessage = 'Invalid Category ID.';
            } else if (err.status === 404) {
              this.errorMessage =
                'No inventory items found for that Category ID.';
            } else {
              this.errorMessage =
                'Failed to load inventory items for that Category ID.';
            }
          },
        });
    }
  }
}
