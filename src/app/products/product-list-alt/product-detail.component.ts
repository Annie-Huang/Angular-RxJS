import {ChangeDetectionStrategy, Component} from '@angular/core';

import { ProductService } from '../product.service';
import {catchError, map} from 'rxjs/operators';
import {EMPTY, Subject} from 'rxjs';
import {Product} from '../product';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  // pageTitle = 'Product Detail';

  // errorMessage = '';
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  // product;

  // "Module07 Reacting to Actions - Note56 - Error msg show for the error in product-detail.component.ts.jpg"
  product$ = this.productService.selectedProduct$
    .pipe(
      catchError(err => {
        // this.errorMessage = err;
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );


  pageTitle$ = this.product$
    .pipe(
      map((p: Product) =>
        p ? `Product Detail for ${p.productName}` : null)
    );


  productSuppliers$ = this.productService.selectedProductSuppliers$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );

  constructor(private productService: ProductService) { }

}
