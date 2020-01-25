import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {combineLatest, Observable, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import { Product } from './product';
import { Supplier } from '../suppliers/supplier';
import { SupplierService } from '../suppliers/supplier.service';
import {ProductCategoryService} from '../product-categories/product-category.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Use the error url to test the catchError in product-list.component.ts
  // private productsUrl = 'api/product'; // error one
  private productsUrl = 'api/products';

  private suppliersUrl = this.supplierService.suppliersUrl;

  // products$ = this.http.get<Product[]>(this.productsUrl)
  //   .pipe(
  //     // map(item => item.price * 1.5),
  //     // map(products =>
  //     //   products.map(product => product.price * 1.5)
  //     // ),
  //     map(products =>
  //       products.map(product => ({
  //         ...product,
  //         price: product.price * 1.5,
  //         searchKey: [product.productName]
  //       }) as Product)
  //     ),
  //     tap(data => console.log('Products: ', JSON.stringify(data))),
  //     catchError(this.handleError)
  //   );

  products$ = this.http.get<Product[]>(this.productsUrl)
    .pipe(
      tap(data => console.log('Products: ', JSON.stringify(data))),
      catchError(this.handleError)
    );

  productWithCategory$ = combineLatest([
    this.products$,
    this.productCategoryService.productCategories$
  ]).pipe(
    map(([products, categories]) =>
      products.map(product => ({
        ...product,
        price: product.price * 1.5,
        // The find() method returns the value of the first element in the provided array that satisfies the provided testing function.
        category: categories.find(c => product.categoryId === c.id).name,
        searchKey: [product.productName]
      }) as Product)
    )
  );

  selectedProduct$ = this.productWithCategory$
    .pipe(
      map(products =>
        products.find(product => product.id === 5)
      ),
      tap(product => console.log('selectedProduct', product))
    );


  // constructor(private http: HttpClient,
  //             private supplierService: SupplierService) { }
  constructor(private http: HttpClient,
              private productCategoryService: ProductCategoryService,
              private supplierService: SupplierService) { }

  // getProducts(): Observable<Product[]> {
  //   return this.http.get<Product[]>(this.productsUrl)
  //     .pipe(
  //       tap(data => console.log('Products: ', JSON.stringify(data))),
  //       catchError(this.handleError)
  //     );
  // }

  private fakeProduct() {
    return {
      id: 42,
      productName: 'Another One',
      productCode: 'TBX-0042',
      description: 'Our new product',
      price: 8.9,
      categoryId: 3,
      category: 'Toolbox',
      quantityInStock: 30
    };
  }

  private handleError(err: any) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

}
