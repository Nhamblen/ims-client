/**
 * Author: John Kuronya
 * Date: 30 November 2025
 * File: inventory-item.component.ts
 * Description: Component for creating a new inventory item.
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
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-inventory-item',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2>Create Inventory Item</h2>

    <form [formGroup]="inventoryForm" (ngSubmit)="onSubmit()">
      <div>
        <label for="categoryId">Category ID</label>
        <input id="categoryId" type="number" formControlName="categoryId" />
        <div *ngIf="f['categoryId'].touched && f['categoryId'].invalid">
          <small class="error">Category ID is required.</small>
        </div>
      </div>

      <div>
        <label for="supplierId">Supplier ID</label>
        <input id="supplierId" type="number" formControlName="supplierId" />
        <div *ngIf="f['supplierId'].touched && f['supplierId'].invalid">
          <small class="error">Supplier ID is required.</small>
        </div>
      </div>

      <div>
        <label for="name">Name</label>
        <input id="name" type="text" formControlName="name" />
        <div *ngIf="f['name'].touched && f['name'].invalid">
          <small class="error">Name is required.</small>
        </div>
      </div>

      <div>
        <label for="description">Description</label>
        <textarea
          id="description"
          rows="3"
          formControlName="description"
        ></textarea>
      </div>

      <div>
        <label for="quantity">Quantity</label>
        <input id="quantity" type="number" formControlName="quantity" />
        <div *ngIf="f['quantity'].touched && f['quantity'].invalid">
          <small class="error">Quantity must be 0 or greater.</small>
        </div>
      </div>

      <div>
        <label for="price">Price</label>
        <input id="price" type="number" step="0.01" formControlName="price" />
        <div *ngIf='f["price"].touched && f["price"].invalid'>
          <small class="error">Price must be 0 or greater.</small>
        </div>
      </div>

      <button type="submit" [disabled]="isSubmitting || inventoryForm.invalid">
        {{ isSubmitting ? 'Saving...' : 'Create Item' }}
      </button>
    </form>

    <!-- messages -->
    <p class="success" *ngIf="successMessage">{{ successMessage }}</p>
    <p class="error" *ngIf="errorMessage">{{ errorMessage }}</p>
  `,
  styles: [
    `
      form {
        max-width: 400px;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      label {
        font-weight: 600;
      }

      input,
      textarea {
        width: 100%;
        padding: 0.25rem 0.5rem;
        box-sizing: border-box;
      }

      button {
        margin-top: 0.5rem;
        padding: 0.5rem 0.75rem;
        cursor: pointer;
      }

      .error {
        color: #b00020;
        font-size: 0.8rem;
      }

      .success {
        color: #006400;
        margin-top: 0.75rem;
      }
    `,
  ],
})
export class InventoryItemComponent {
  inventoryForm: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  // base URL for API
  private apiUrl = `${environment.apiBaseUrl}/api/inventory`;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.inventoryForm = this.fb.group({
      categoryId: ['', Validators.required],
      supplierId: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      quantity: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
    });
  }

  // Convenience getter for template and tests
  get f() {
    return this.inventoryForm.controls;
  }

  onSubmit(): void {
    // reset messages
    this.successMessage = '';
    this.errorMessage = '';

    if (this.inventoryForm.invalid) {
      this.inventoryForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.http.post(this.apiUrl, this.inventoryForm.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Inventory item created successfully.';
        this.inventoryForm.reset();
      },
      error: (err) => {
        console.error('Create inventory error (full):', err);
        console.error('Backend error payload:', err.error);
        this.isSubmitting = false;
        this.errorMessage =
          'Failed to create inventory item. Please try again.';
      },
    });
  }
}
