import {ChangeDetectionStrategy, Component} from '@angular/core';

import { ProductService } from '../product.service';
import {catchError, filter, map} from 'rxjs/operators';
import {combineLatest, EMPTY, Subject} from 'rxjs';
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

  // The structure for vm$ is Observable<{product: Product; productSuppliers: Supplier[]; pageTitle: string}>
  vm$ = combineLatest([
    this.product$,
    this.productSuppliers$,
    this.pageTitle$
  ])
    .pipe(
      // During distruction, all element has to be put into [], and this need to be inside a ().
      // if you have filter([product] => Boolean(product)), you will get compile error
      filter(([product]) => Boolean(product)),
      map(([product, productSuppliers, pageTitle]) =>
        ({product, productSuppliers, pageTitle})
      )
    );


  constructor(private productService: ProductService) { }

}
