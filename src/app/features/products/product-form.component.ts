import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { ToastService } from '../../core/services/toast.service';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ButtonComponent],
  template: `
    <div>
      <!-- Back button -->
      <div class="detail-header">
        <a routerLink="/dashboard/products" class="back-btn">
          <i class="pi pi-arrow-left"></i>
          Back to Products
        </a>
      </div>

      <div class="card">
        <h2 style="font-size: 18px; font-weight: 700; color: #1e3a5f; margin-bottom: 24px;">
          <i class="pi {{ isEdit() ? 'pi-pencil' : 'pi-plus-circle' }}" style="margin-right: 8px;"></i>
          {{ isEdit() ? 'Edit Product' : 'Add New Product' }}
        </h2>

        <!-- Loading for edit -->
        <div class="spinner-wrapper" *ngIf="loadingProduct()">
          <div class="spinner"></div>
        </div>

        <form [formGroup]="productForm" (ngSubmit)="onSubmit()" *ngIf="!loadingProduct()">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <!-- Title -->
            <div class="form-group" style="grid-column: 1 / -1;">
              <label class="form-label">Product Title <span style="color:#f44336">*</span></label>
              <input
                type="text"
                formControlName="title"
                class="form-control"
                placeholder="Enter product title"
                [class.ng-invalid]="f['title'].invalid && f['title'].touched"
                [class.ng-touched]="f['title'].touched"
              />
              <div class="error-text" *ngIf="f['title'].invalid && f['title'].touched">
                Title is required (min 3 characters)
              </div>
            </div>

            <!-- Description -->
            <div class="form-group" style="grid-column: 1 / -1;">
              <label class="form-label">Description <span style="color:#f44336">*</span></label>
              <textarea
                formControlName="description"
                class="form-control"
                placeholder="Enter product description"
                rows="4"
                style="resize: vertical;"
                [class.ng-invalid]="f['description'].invalid && f['description'].touched"
                [class.ng-touched]="f['description'].touched"
              ></textarea>
              <div class="error-text" *ngIf="f['description'].invalid && f['description'].touched">
                Description is required
              </div>
            </div>

            <!-- Price -->
            <div class="form-group">
              <label class="form-label">Price ($) <span style="color:#f44336">*</span></label>
              <input
                type="number"
                formControlName="price"
                class="form-control"
                placeholder="0.00"
                min="0"
                step="0.01"
                [class.ng-invalid]="f['price'].invalid && f['price'].touched"
                [class.ng-touched]="f['price'].touched"
              />
              <div class="error-text" *ngIf="f['price'].invalid && f['price'].touched">
                Price must be a positive number
              </div>
            </div>

            <!-- Discount -->
            <div class="form-group">
              <label class="form-label">Discount Percentage</label>
              <input
                type="number"
                formControlName="discountPercentage"
                class="form-control"
                placeholder="0"
                min="0"
                max="100"
              />
            </div>

            <!-- Stock -->
            <div class="form-group">
              <label class="form-label">Stock Quantity <span style="color:#f44336">*</span></label>
              <input
                type="number"
                formControlName="stock"
                class="form-control"
                placeholder="0"
                min="0"
                [class.ng-invalid]="f['stock'].invalid && f['stock'].touched"
                [class.ng-touched]="f['stock'].touched"
              />
              <div class="error-text" *ngIf="f['stock'].invalid && f['stock'].touched">
                Stock must be 0 or greater
              </div>
            </div>

            <!-- Brand -->
            <div class="form-group">
              <label class="form-label">Brand <span style="color:#f44336">*</span></label>
              <input
                type="text"
                formControlName="brand"
                class="form-control"
                placeholder="Brand name"
                [class.ng-invalid]="f['brand'].invalid && f['brand'].touched"
                [class.ng-touched]="f['brand'].touched"
              />
              <div class="error-text" *ngIf="f['brand'].invalid && f['brand'].touched">
                Brand is required
              </div>
            </div>

            <!-- Category -->
            <div class="form-group">
              <label class="form-label">Category <span style="color:#f44336">*</span></label>
              <select
                formControlName="category"
                class="form-control"
                [class.ng-invalid]="f['category'].invalid && f['category'].touched"
                [class.ng-touched]="f['category'].touched"
              >
                <option value="">Select category</option>
                <option *ngFor="let cat of categories()" [value]="cat">{{ cat }}</option>
              </select>
              <div class="error-text" *ngIf="f['category'].invalid && f['category'].touched">
                Please select a category
              </div>
            </div>

            <!-- Thumbnail URL -->
            <div class="form-group" style="grid-column: 1 / -1;">
              <label class="form-label">Thumbnail URL</label>
              <input
                type="url"
                formControlName="thumbnail"
                class="form-control"
                placeholder="https://example.com/image.jpg"
              />
              <!-- Preview -->
              <div
                *ngIf="f['thumbnail'].value"
                style="margin-top: 12px; width: 120px; height: 120px; border-radius: 8px; overflow: hidden; border: 2px solid #e0e0e0;"
              >
                <img
                  [src]="f['thumbnail'].value"
                  alt="Preview"
                  style="width: 100%; height: 100%; object-fit: cover;"
                  onerror="this.style.display='none'"
                />
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px; padding-top: 24px; border-top: 1px solid #f0f0f0;">
            <a routerLink="/dashboard/products" class="btn btn-outline">
              <i class="pi pi-times"></i>
              Cancel
            </a>
            <app-button
              [type]="'submit'"
              [label]="isEdit() ? 'Update Product' : 'Create Product'"
              [icon]="isEdit() ? 'pi pi-check' : 'pi pi-plus'"
              variant="primary"
              [loading]="loading()"
            ></app-button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private toastService = inject(ToastService);

  isEdit = signal(false);
  loading = signal(false);
  loadingProduct = signal(false);
  categories = signal<string[]>([]);
  productId = signal<number | null>(null);

  productForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0.01)]],
    discountPercentage: [0],
    stock: [0, [Validators.required, Validators.min(0)]],
    brand: ['', [Validators.required]],
    category: ['', [Validators.required]],
    thumbnail: ['']
  });

  get f() { return this.productForm.controls; }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.productId.set(Number(id));
      this.loadProduct(Number(id));
    }

    this.productService.getCategories().subscribe({
      next: (cats) => this.categories.set(cats)
    });
  }

  loadProduct(id: number): void {
    this.loadingProduct.set(true);
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          title: product.title,
          description: product.description,
          price: product.price,
          discountPercentage: product.discountPercentage,
          stock: product.stock,
          brand: product.brand,
          category: product.category,
          thumbnail: product.thumbnail
        });
        this.loadingProduct.set(false);
      },
      error: () => {
        this.loadingProduct.set(false);
        this.toastService.error('Failed to load product data');
        this.router.navigate(['/dashboard/products']);
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const payload = this.productForm.value;

    const request = this.isEdit()
      ? this.productService.updateProduct(this.productId()!, payload)
      : this.productService.createProduct(payload);

    request.subscribe({
      next: (product) => {
        this.toastService.success(
          this.isEdit()
            ? `"${product.title}" updated successfully!`
            : `"${product.title}" created successfully!`
        );
        this.loading.set(false);
        this.router.navigate(['/dashboard/products']);
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error(
          this.isEdit() ? 'Failed to update product' : 'Failed to create product'
        );
      }
    });
  }
}