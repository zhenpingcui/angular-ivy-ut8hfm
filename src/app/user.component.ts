import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { R } from './core/crud';
import { Disposable, loadData } from './core/view.cache';
import { userDao } from './model/user.dao';

@Component({
  selector: 'user',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<div>{{ counter }} {{ user }}</div>',
  styles: [`h1 { font-family: Lato; }`],
})
export class UserComponent implements OnInit, OnDestroy {
  @Input() userId: string;

  disposable: Disposable;

  counter: number = 0;
  user = '';

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.disposable = loadData(this.refresh.bind(this));
  }
  ngOnDestroy(): void {
    this.disposable.dispose();
  }

  refresh(ctx: R) {
    this.counter++;
    const user = userDao.get(this.userId, ctx);
    this.user = JSON.stringify(user);
    this.cd.detectChanges();
  }
}
