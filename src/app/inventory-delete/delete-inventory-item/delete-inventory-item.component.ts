/**
 * Author: John Kuronya
 * Date: 8 December 2025
 * File: delete-inventory-item.component.ts
 * Description: Standalone component to delete an inventory item by ID.
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-delete-inventory-item',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2>Delete Inventory Item</h2>

    <form [formGroup]="deleteForm" (ngSubmit)="onSubmit()">
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

      <button type="submit" [disabled]="isLoading || deleteForm.invalid">
        {{ isLoading ? 'Deleting...' : 'Delete Item' }}
      </button>
    </form>

    <!-- messages -->
    <p *ngIf="successMessage" class="success">
      {{ successMessage }}
    </p>
    <p *ngIf="errorMessage" class="error">
      {{ errorMessage }}
    </p>
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

      .success {
        color: #006400;
        font-size: 0.9rem;
        margin-top: 0.5rem;
      }
    `,
  ],
})
export class DeleteInventoryItemComponent {
  deleteForm: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.deleteForm = this.fb.group({
      id: ['', Validators.required],
    });
  }

  // convenience getter
  get f() {
    return this.deleteForm.controls;
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.deleteForm.invalid) {
      this.deleteForm.markAllAsTouched();
      this.errorMessage = 'Inventory ID is required.';
      return;
    }

    const id = (this.deleteForm.value.id as string).trim();

    if (!id) {
      this.errorMessage = 'Inventory ID is required.';
      return;
    }

    this.isLoading = true;

    this.http
      .delete<{ message: string; id?: string }>(
        `${environment.apiBaseUrl}/api/inventory/${id}`
      )
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.successMessage = res.message || 'Inventory item deleted successfully.';
          this.deleteForm.reset();
        },
        error: (err) => {
          this.isLoading = false;

          if (err.status === 404) {
            this.errorMessage = 'Inventory item not found.';
          } else if (err.status === 400) {
            this.errorMessage = 'Invalid inventory ID.';
          } else {
            this.errorMessage = 'Failed to delete inventory item.';
          }
        },
      });
  }
}
