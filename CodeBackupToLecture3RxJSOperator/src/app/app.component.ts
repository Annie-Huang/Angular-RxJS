import {Component, OnInit} from '@angular/core';
import {from, of} from 'rxjs';
import {map, take, tap} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Angular-RxJS';

  ngOnInit(): void {
    // we'll pass console.log into the subscribe method as our next function.
    // Of automatically complete, so we don't need to unsubscribe.
    of(2, 4, 6, 8).subscribe(console.log);  // I didn't know you can pass the log like this.

    from([20, 15, 10, 5]).subscribe(
      item => console.log(`resulting item .. ${item}`),
      err => console.error(`error occurred ${err}`),
      () => console.log('complete')
    );

    of('Apple1', 'Apple2', 'Apple3', 'Apple4').subscribe(
      apple => console.log(`Apple was emitted ${apple}`),
      err => console.error(`Error occurred ${err}`),
      () => console.log('No more apples, go home')
    );

    from([20, 15, 10, 5])
      .pipe(
        tap(item => console.log(`emitted item ... ${item}`)),
        map(item => item * 2),
        map(item => item - 10),
        map(item => {
          if (item === 0) {
            throw new Error('zero');
          }
          return item; // if you don't return, other instance with non zero value cannot pass through
          // Notice when Error occurs, it will not do the complete section.
        }),
        take(3) // Only take 3 input can successfully complete the subscribe call.
      )
      .subscribe(
      item => console.log(`resulting item .. ${item}`),
      err => console.error(`error occurred ${err}`),
      () => console.log('complete')
    );
  }
}
