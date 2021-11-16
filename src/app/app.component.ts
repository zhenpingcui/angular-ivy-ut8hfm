import {
  Component,
  VERSION,
  DoCheck,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  OnInit,
  NgZone,
} from '@angular/core';
import {
  Proto,
  businessDirector,
  Request,
  AppCache,
  appCache,
  DeepReadonly,
  entityRefFactory,
} from './core';
import { User, UserRef } from './model/user.gen';
import { userDao } from './model/user.dao';
import { Methods } from './businesses/user.gen';
import { UserBusiness } from './businesses/user.business';
import { ApiClient } from './core/business';
import { userBusinessDescriptor } from './businesses/user.descriptor';
import { CommonInput } from './businesses/params';
import { Disposable, loadData } from './core/view.cache';
import { R } from './core/crud';
import 'zone.js';
UserBusiness.init();

const client = new ApiClient({
  onFailed: (error) => {
    return false;
  },
  onSend: (action) => {
    return action;
  },
  onSuccess: (response) => {
    console.log('success');
    const common: CommonInput = response;
    if (common.user) {
      appCache.upsert(common.user);
    }
    if (common.users) {
      const start = Date.now();
      common.users.forEach((user) => appCache.upsert(user));
      const duration = Date.now() - start;
      console.log(duration);
    }
  },
});
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy, OnInit {
  disposable: Disposable;
  counter = 0;
  user?: DeepReadonly<User>;

  constructor(private cd: ChangeDetectorRef) {}
  init = false;
  ngOnInit(): void {
    this.disposable = loadData((ctx) => {
      this.refresh(ctx);
    });
    client.callApi(userBusinessDescriptor, 'get', { userId: '1' });
  }
  ngOnDestroy(): void {
    this.disposable.dispose();
  }

  refresh(cache: R) {
    this.user = userDao.get('1', cache);
    let ref = entityRefFactory.create(this.user);

    // user.entityId;
    // user.following;
    // user._runtime;
    this.counter++;
    this.cd.detectChanges();
  }
  load() {
    client.callApi(userBusinessDescriptor, 'get', { userId: '1' });
  }
  follow() {
    client.callApi(userBusinessDescriptor, 'follow', {
      user: this.user,
    });
  }
  trackByFn(idx: number, follow: DeepReadonly<UserRef>) {
    return follow.entityId;
  }
}
