import { Component } from '@angular/core';
import { update } from './store';

@Component({
  selector: 'hello',
  template: `<h1><button (click)="newRecord()">submit</button></h1><span class="foo">child</span>`,
  styles: [`h1 { font-family: Lato; }`],
})
export class HelloComponent {
  counter: number = 0;

  newRecord() {
    this.counter++;
    update(this.counter);
  }
}
