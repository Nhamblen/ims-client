/**
 * Author: John Kuronya
 * Date: 16 December 2025
 * File: supplier-create.component.ts
 * Description: Component for creating a new supplier.
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
  selector: 'app-supplier-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2>Create Supplier</h2>

    <form [formGroup]="supplierForm" (ngSubmit)="onSubmit()">
      <div>
        <label for="supplierId">Supplier ID</label>
        <input id="supplierId" type="number" formControlName="supplierId" />
        <div *ngIf="f['supplierId'].touched && f['supplierId'].invalid" class="error">
          <small>Supplier ID is required.</small>
        </div>
      </div>

      <div>
        <label for="supplierName">Supplier Name</label>
        <input id="supplierName" type="text" formControlName="supplierName" />
        <div *ngIf="f['supplierName'].touched && f['supplierName'].invalid" class="error">
          <small>Supplier name is required.</small>
        </div>
      </div>

      <div>
        <label for="contactInformation">Contact Information</label>
        <input
          id="contactInformation"
          type="text"
          formControlName="contactInformation"
          placeholder="e.g. 133-456-7890"
        />
        <div *ngIf="f['contactInformation'].touched && f['contactInformation'].invalid" class="error">
          <small>Contact information is required.</small>
        </div>
      </div>

      <div>
        <label for="address">Address</label>
        <textarea id="address" rows="2" formControlName="address"></textarea>
        <div *ngIf="f['address'].touched && f['address'].invalid" class="error">
          <small>Address is required.</small>
        </div>
      </div>

      <button type="submit" [disabled]="isSubmitting || supplierForm.invalid">
        {{ isSubmitting ? 'Saving...' : 'Create Supplier' }}
      </button>
    </form>

    <p *ngIf="successMessage" class="success">{{ successMessage }}</p>
    <p *ngIf="errorMessage" class="error">{{ errorMessage }}</p>
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
        align-self: flex-start;
        padding: 0.4rem 0.8rem;
        cursor: pointer;
      }

      .error {
        color: #b00020;
        font-size: 0.8rem;
        margin-top: 0.25rem;
      }

      .success {
        color: #006400;
        font-size: 0.9rem;
      }
    `,
  ],
})
export class SupplierCreateComponent {
  supplierForm: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.supplierForm = this.fb.group({
      supplierId: ['', Validators.required],
      supplierName: ['', Validators.required],
      contactInformation: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  get f() {
    return this.supplierForm.controls;
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.supplierForm.invalid) {
      this.supplierForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.http
      .post(`${environment.apiBaseUrl}/api/supplier`, this.supplierForm.value)
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.successMessage = 'Supplier created successfully.';
          this.supplierForm.reset();
        },
        error: () => {
          this.isSubmitting = false;
          this.errorMessage = 'Failed to create supplier. Please try again.';
        },
      });
  }
}

