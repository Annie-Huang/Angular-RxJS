import {Component, OnInit} from '@angular/core';
import {from, of} from 'rxjs';
import {log} from 'util';

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
    of(2, 4, 6, 8).subscribe(console.log);

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
  }
}
