import {Component, OnInit, OnDestroy, ChangeDetectionStrategy} from '@angular/core';

import {EMPTY, Subject, Subscription} from 'rxjs';

import { Product } from '../product';
import { ProductService } from '../product.service';
import {catchError} from 'rxjs/operators';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
// export class ProductListAltComponent implements OnInit, OnDestroy {
export class ProductListAltComponent {
  pageTitle = 'Products';

  // // ChangeDetectionStrategy.OnPush will cause any change on errorMessage not to revaluate, because it's not an obserable.
  // errorMessage = '';
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  // selectedProductId;

  // products: Product[] = [];
  // sub: Subscription;

  // // products$ = this.productService.products$
  // products$ = this.productService.productWithCategory$
  //   .pipe(
  //     catchError(err => {
  //       this.errorMessage = err;
  //       return EMPTY;
  //     })
  //   );
  // "Module07 Reacting to Actions - Note55 - Error msg show for the error in product-list-alt.component.ts.jpg"
  products$ = this.productService.productWithCategory$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );
  selectedProduct$ = this.productService.selectedProduct$;

  constructor(private productService: ProductService) { }

  // ngOnInit(): void {
  //   this.sub = this.productService.getProducts().subscribe(
  //     products => this.products = products,
  //     error => this.errorMessage = error
  //   );
  // }
  //
  // ngOnDestroy(): void {
  //   this.sub.unsubscribe();
  // }

  onSelected(productId: number): void {
    // console.log('Not yet implemented');
    this.productService.selectedProductChanged(productId);
  }
}
