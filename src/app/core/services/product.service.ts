import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductRequest, ProductsResponse } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;

  getProducts(limit = 10, skip = 0): Observable<ProductsResponse> {
    const params = new HttpParams()
      .set('limit', limit)
      .set('skip', skip);
    return this.http.get<ProductsResponse>(this.apiUrl, { params });
  }

  searchProducts(query: string, limit = 10, skip = 0): Observable<ProductsResponse> {
    const params = new HttpParams()
      .set('q', query)
      .set('limit', limit)
      .set('skip', skip);
    return this.http.get<ProductsResponse>(`${this.apiUrl}/search`, { params });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: ProductRequest): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/add`, product);
  }

  updateProduct(id: number, product: Partial<ProductRequest>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<{ id: number; isDeleted: boolean; deletedOn: string }> {
    return this.http.delete<{ id: number; isDeleted: boolean; deletedOn: string }>(`${this.apiUrl}/${id}`);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }
}