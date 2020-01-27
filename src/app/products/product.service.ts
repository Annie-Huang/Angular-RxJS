import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {BehaviorSubject, combineLatest, from, merge, Observable, Subject, throwError} from 'rxjs';
import {catchError, filter, map, mergeMap, scan, shareReplay, switchMap, tap, toArray} from 'rxjs/operators';

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
    ),
    shareReplay(1) // Add it here instead of products$ so we don't need to re-executed the productWithCategory$ on every subscription
  );

  // Compared to categorySelectedSubject in product-list.component.ts. We defined the productSElectedSubject in service because both
  //     product-list.component.ts (for styling) and product-detail.component.ts （for displaying product) need this information.
  // set initial value to 0.
  private productSelectedSubject = new BehaviorSubject<number>(0);
  productSelectedAction$ = this.productSelectedSubject.asObservable();

  // selectedProduct$ = this.productWithCategory$
  //   .pipe(
  //     map(products =>
  //       products.find(product => product.id === 5)
  //     ),
  //     tap(product => console.log('selectedProduct', product))
  //   );
  selectedProduct$ = combineLatest([
    this.productWithCategory$,
    this.productSelectedAction$
  ])
    .pipe(
      map(([products, selectedProductId]) =>
        products.find(product => product.id === selectedProductId)
      ),
      tap(product => console.log('selectedProduct', product)),
      shareReplay(1)
    );


  private productInsertSubject = new Subject<Product>();
  productInsertAction$ = this.productInsertSubject.asObservable();

  productWithAdd$ = merge(
    this.productWithCategory$,
    this.productInsertAction$
  )
    .pipe(
      scan((acc: Product[], value: Product) => [...acc, value])
    );

  // // This returns a Observable<Suppl      )ier[]>
  // selectedProductSuppliers$ = combineLatest([
  //   this.selectedProduct$,
  //   this.supplierService.suppliers$
  // ]).pipe(
  //   map(([selectedProduct, suppliers]) =>
  //     suppliers.filter(supplier => selectedProduct.supplierIds.includes(supplier.id))
  //   )
  // );

  // This returns a Observable<Supplier[]>
  selectedProductSuppliers$ = this.selectedProduct$
    .pipe(
      filter(selectedProduct => Boolean(selectedProduct)),
      // Need to change to switchMap incase users clicks among products too quickly. We want to cancle out the previous clicks
      // Otherwise, it depends on which api returns later, the product detail may show the product detail of
      // the previous clicked product, not the last clicked one.
      // Also improve performance.
      // mergeMap(selectedProduct =>
      switchMap(selectedProduct =>
        from(selectedProduct.supplierIds)
          .pipe(
            mergeMap(supplierId => this.http.get<Supplier>(`${this.suppliersUrl}/${supplierId}`)),
            toArray(),
            tap(suppliers => console.log('product suppliers', JSON.stringify(suppliers)))
          )
      )
    );


  // constructor(private http: HttpClient,
  //             private supplierService: SupplierService) { }
  constructor(private http: HttpClient,
              private productCategoryService: ProductCategoryService,
              private supplierService: SupplierService) { }

  // Anywhere from the app we can call this method and the selectedProduct$ will reevaluate again.
  selectedProductChanged(selectedProductId: number): void {
    // Every time we receive a new change, this will cause productSelectedAction$ to change and hence selectedProduct$ changes as well.
    this.productSelectedSubject.next(selectedProductId);
  }

  // getProducts(): Observable<Product[]> {
  //   return this.http.get<Product[]>(this.productsUrl)
  //     .pipe(
  //       tap(data => console.log('Products: ', JSON.stringify(data))),
  //       catchError(this.handleError)
  //     );
  // }

  addProduct(newProduct?: Product) {
    newProduct = newProduct || this.fakeProduct();
    this.productInsertSubject.next(newProduct);
  }

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
