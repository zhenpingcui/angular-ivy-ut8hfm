import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { subscribe, localStore } from './store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'hello2',
  template: `<h1>{{ render() }}</h1>`,
  styles: [`h1 { font-family: Lato; }`],
})
export class Hello2Component {
  store? = localStore;

  constructor(private cd: ChangeDetectorRef) {
    subscribe(() => {
      console.log('receive');
      this.store = localStore;
      cd.detectChanges();
    });
  }

  render(): string {
    console.log('render hello2');
    return JSON.stringify(this.store);
  }
}
