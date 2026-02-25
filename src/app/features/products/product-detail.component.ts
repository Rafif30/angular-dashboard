import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div>
      <!-- Back button -->
      <div class="detail-header">
        <a routerLink="/dashboard/products" class="back-btn">
          <i class="pi pi-arrow-left"></i>
          Back to Products
        </a>
        <div style="display: flex; gap: 8px; margin-left: auto;">
          <a
            *ngIf="product()"
            [routerLink]="['/dashboard/products/edit', product()!.id]"
            class="btn btn-warning"
          >
            <i class="pi pi-pencil"></i>
            Edit Product
          </a>
        </div>
      </div>

      <!-- Loading -->
      <div class="spinner-wrapper" *ngIf="loading()">
        <div class="spinner"></div>
      </div>

      <!-- Product Detail -->
      <div *ngIf="product() && !loading()">
        <div style="display: grid; grid-template-columns: 1fr 1.5fr; gap: 24px;">
          <!-- Left: Images -->
          <div>
            <div class="card" style="padding: 16px;">
              <img
                [src]="selectedImage()"
                [alt]="product()!.title"
                class="product-detail-image"
                onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22><rect width=%22400%22 height=%22300%22 fill=%22%23f5f5f5%22/><text x=%22200%22 y=%22155%22 font-size=%2248%22 text-anchor=%22middle%22 fill=%22%23ccc%22>📦</text></svg>'"
              />

              <!-- Thumbnails -->
              <div style="display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap;" *ngIf="product()!.images.length > 1">
                <img
                  *ngFor="let img of product()!.images.slice(0, 5)"
                  [src]="img"
                  [alt]="product()!.title"
                  (click)="selectedImage.set(img)"
                  style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; cursor: pointer; border: 2px solid transparent; transition: border-color 0.2s;"
                  [style.borderColor]="selectedImage() === img ? '#4a9eff' : 'transparent'"
                  onerror="this.style.display='none'"
                />
              </div>
            </div>
          </div>

          <!-- Right: Info -->
          <div>
            <div class="card">
              <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px;">
                <div>
                  <span class="badge-category">{{ product()!.category }}</span>
                  <h2 style="font-size: 22px; font-weight: 700; color: #1e3a5f; margin-top: 8px;">
                    {{ product()!.title }}
                  </h2>
                  <p style="font-size: 13px; color: #888; margin-top: 4px;">by {{ product()!.brand }}</p>
                </div>
                <div class="rating-stars" style="flex-shrink: 0;">
                  <i class="pi pi-star-fill"></i>
                  <span style="font-size: 15px; font-weight: 600; color: #555;">{{ product()!.rating }}</span>
                </div>
              </div>

              <!-- Price -->
              <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
                <span class="price-tag">\${{ product()!.price | number:'1.2-2' }}</span>
                <span
                  style="background: #e8f5e9; color: #2e7d32; padding: 4px 10px; border-radius: 20px; font-size: 13px; font-weight: 600;"
                  *ngIf="product()!.discountPercentage > 0"
                >
                  -{{ product()!.discountPercentage | number:'1.0-0' }}% OFF
                </span>
              </div>

              <!-- Description -->
              <p style="font-size: 14px; color: #555; line-height: 1.7; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #f0f0f0;">
                {{ product()!.description }}
              </p>

              <!-- Info rows -->
              <div class="info-row">
                <span class="info-label"><i class="pi pi-box" style="margin-right: 6px;"></i>Stock</span>
                <span [class]="getStockClass(product()!.stock)">{{ product()!.stock }} units</span>
              </div>
              <div class="info-row">
                <span class="info-label"><i class="pi pi-tag" style="margin-right: 6px;"></i>Brand</span>
                <span class="info-value">{{ product()!.brand }}</span>
              </div>
              <div class="info-row">
                <span class="info-label"><i class="pi pi-list" style="margin-right: 6px;"></i>Category</span>
                <span class="info-value" style="text-transform: capitalize;">{{ product()!.category }}</span>
              </div>
              <div class="info-row">
                <span class="info-label"><i class="pi pi-percentage" style="margin-right: 6px;"></i>Discount</span>
                <span class="info-value">{{ product()!.discountPercentage | number:'1.1-1' }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error state -->
      <div class="card" *ngIf="error() && !loading()">
        <div class="empty-state">
          <i class="pi pi-exclamation-circle"></i>
          <h3>Product not found</h3>
          <p>The product you're looking for doesn't exist or has been deleted.</p>
          <a routerLink="/dashboard/products" class="btn btn-primary" style="margin-top: 16px;">
            Back to Products
          </a>
        </div>
      </div>
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  product = signal<Product | null>(null);
  selectedImage = signal('');
  loading = signal(true);
  error = signal(false);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product.set(product);
        this.selectedImage.set(product.thumbnail || (product.images[0] || ''));
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set(true);
      }
    });
  }

  getStockClass(stock: number): string {
    if (stock === 0) return 'stock-badge out-stock';
    if (stock < 10) return 'stock-badge low-stock';
    return 'stock-badge in-stock';
  }
}