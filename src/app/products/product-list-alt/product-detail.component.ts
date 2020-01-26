import {ChangeDetectionStrategy, Component} from '@angular/core';

import { ProductService } from '../product.service';
import {catchError} from 'rxjs/operators';
import {EMPTY, Subject} from 'rxjs';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  pageTitle = 'Product Detail';

  // errorMessage = '';
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  // product;

  product$ = this.productService.selectedProduct$
    .pipe(
      catchError(err => {
        // this.errorMessage = err;
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );

  constructor(private productService: ProductService) { }

}
