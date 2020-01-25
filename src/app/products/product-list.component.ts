import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { EMPTY, Observable } from 'rxjs';

import { Product } from './product';
import { ProductService } from './product.service';
import {catchError, map} from 'rxjs/operators';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';
  categories;
  selectedCategoryId = 1;

  // products: Product[] = [];
  // sub: Subscription;

  // Now I look at the code, I don't 100% understand why this.products$ = this.productService.getProducts() have to be inside ngOnIit()?
  // products$: Observable<Product[]>;
  // products$ = this.productService.products$
  products$ = this.productService.productWithCategory$
    .pipe(
      catchError(err => {
        this.errorMessage = err;
        // return of([]); // The same as below
        return EMPTY; // Observable that immediately completes.
      })
    );

  productSimpleFilter$ = this.productService.productWithCategory$
    .pipe(
      map(products =>
        products.filter(product =>
          this.selectedCategoryId ? product.categoryId === this.selectedCategoryId : true // show all if there is no selectedCategoryId
        )
      )
    );



  constructor(private productService: ProductService) { }

  // ngOnInit(): void {
  //   // this.sub = this.productService.getProducts()
  //   //   .subscribe(
  //   //     products => this.products = products,
  //   //     error => this.errorMessage = error
  //   //   );
  //
  //   // Do it this way so we can keep the async pipe in the product-list.component.html
  //   // 1. So we don't need to subscribe (ngOnInit) and unsubscribe (onDestory)
  //   // 2. Also improve change detection (can switch changeDetection to 'OnPush'
  //   // Module04 Going Reactive - Note26 - Change Detection Strategies and why anyc pipe on observable can improve change detection cycle.jpg
  //   this.products$ = this.productService.getProducts()
  //     .pipe(
  //       catchError(err => {
  //         this.errorMessage = err;
  //         // return of([]); // The same as below
  //         return EMPTY;
  //       })
  //     );
  // }

  // ngOnDestroy(): void {
  //   this.sub.unsubscribe();
  // }

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    console.log('Not yet implemented');
  }
}
