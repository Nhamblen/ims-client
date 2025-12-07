/**
 * Author: John Kuronya
 * Date: 7 December 2025
 * File: inventory-item-by-id.component.ts
 * Description: Standalone component to read an inventory item by ID.
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
    <h2>Inventory Item by ID</h2>

    <form [formGroup]="idForm" (ngSubmit)="onSubmit()">
      <label for="itemId">Inventory ID</label>
      <input
        id="itemId"
        type="text"
        formControlName="id"
        placeholder="Enter inventory _id"
      />

      <div *ngIf="f['id'].touched && f['id'].invalid" class="error">
        <small *ngIf="f['id'].errors?.['required']">
          Inventory ID is required.
        </small>
      </div>

      <button type="submit" [disabled]="isLoading || idForm.invalid">
        {{ isLoading ? 'Loading...' : 'Load Item' }}
      </button>
    </form>

    <!-- Error message -->
    <p *ngIf="errorMessage" class="error">
      {{ errorMessage }}
    </p>

    <!-- Item details -->
    <div *ngIf="item" class="card">
      <p><strong>ID:</strong> {{ item._id }}</p>
      <p><strong>Name:</strong> {{ item.name }}</p>
      <p><strong>Description:</strong> {{ item.description || 'N/A' }}</p>
      <p><strong>Category ID:</strong> {{ item.categoryId }}</p>
      <p><strong>Supplier ID:</strong> {{ item.supplierId }}</p>
      <p><strong>Quantity:</strong> {{ item.quantity }}</p>
      <p><strong>Price:</strong> {{ item.price | currency }}</p>
    </div>
  `,
  styles: [
    `
      form {
        max-width: 400px;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      label {
        font-weight: 600;
      }

      input {
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
      }

      h2 {
        margin-bottom: 1rem;
      }
    `,
  ],
})
export class InventoryItemByIdComponent {
  idForm: FormGroup;
  item: InventoryItem | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.idForm = this.fb.group({
      id: ['', Validators.required],
    });
  }

  get f() {
    return this.idForm.controls;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.item = null;

    if (this.idForm.invalid) {
      this.idForm.markAllAsTouched();
      return;
    }

    const id = this.idForm.value.id.trim();
    if (!id) {
      this.errorMessage = 'Inventory ID is required.';
      return;
    }

    this.isLoading = true;

    this.http
      .get<InventoryItem>(`${environment.apiBaseUrl}/api/inventory/${id}`)
      .subscribe({
        next: (data) => {
          this.item = data;
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
  }
}
