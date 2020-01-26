import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import {BehaviorSubject, combineLatest, EMPTY, Observable, Subject} from 'rxjs';

import { Product } from './product';
import { ProductService } from './product.service';
import {catchError, map, startWith} from 'rxjs/operators';
import {ProductCategoryService} from '../product-categories/product-category.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = 'Product List';

  // errorMessage = '';
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  // categories;
  // selectedCategoryId = 1;

  // private categorySelectedSubject = new Subject<number>();
  private categorySelectedSubject = new BehaviorSubject<number>(0);
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();

  // products: Product[] = [];
  // sub: Subscription;

  // // Now I look at the code, I don't 100% understand why this.products$ = this.productService.getProducts() have to be inside ngOnIit()?
  // // products$: Observable<Product[]>;
  // // products$ = this.productService.products$
  // products$ = this.productService.productWithCategory$
  //   .pipe(
  //     catchError(err => {
  //       this.errorMessage = err;
  //       // return of([]); // The same as below
  //       return EMPTY; // Observable that immediately completes.
  //     })
  //   );

  // On initialLoad will not display the whole list as combineLastest is waiting for both stream to emit at least one value.
  // "Module08 Reacting to Actions Examples - Note57 - Error msg show for the error in product-list.component.ts Part1.jpg"
  products$ = combineLatest([
    this.productService.productWithCategory$,
    this.categorySelectedAction$
    // this.categorySelectedAction$
    //   .pipe(
    //     startWith(0)
    //   )
  ]).pipe(
    map(([products, selectedCategoryId]) =>
      products.filter(product =>
        selectedCategoryId ? product.categoryId === selectedCategoryId : true
      )
    ),
    catchError(err => {
      // this.errorMessage = err;
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  // "Module08 Reacting to Actions Examples - Note57 - Error msg show for the error in product-list.component.ts Part2.jpg"
  categories$ = this.productCategoryService.productCategories$
    .pipe(
      catchError(err => {
        // this.errorMessage = err;
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );

  // productSimpleFilter$ = this.productService.productWithCategory$
  //   .pipe(
  //     map(products =>
  //       products.filter(product =>
  //         this.selectedCategoryId ? product.categoryId === this.selectedCategoryId : true // show all if there is no selectedCategoryId
  //       )
  //     )
  //   );


  // constructor(private productService: ProductService) { }
  constructor(private productService: ProductService, private productCategoryService: ProductCategoryService) { }

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
    // console.log('Not yet implemented');

    // // This + is to cast it to a number
    // this.selectedCategoryId = +categoryId;

    this.categorySelectedSubject.next(+categoryId);
  }
}
