import { Component, OnInit, OnDestroy } from '@angular/core';

import {EMPTY, Observable, of, Subscription} from 'rxjs';

import { Product } from './product';
import { ProductService } from './product.service';
import {catchError, tap} from 'rxjs/operators';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  pageTitle = 'Product List';
  errorMessage = '';
  categories;

  // products: Product[] = [];
  // sub: Subscription;
  products$: Observable<Product[]>;


  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    // this.sub = this.productService.getProducts()
    //   .subscribe(
    //     products => this.products = products,
    //     error => this.errorMessage = error
    //   );
    this.products$ = this.productService.getProducts()
      .pipe(
        catchError(err => {
          this.errorMessage = err;
          // return of([]); // The same as below
          return EMPTY;
        })
      );
  }

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
