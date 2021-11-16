import { Business, Request, Response } from '../core';
import { businessDirector } from '../core/business';
import { userDao } from '../model/user.dao';
import { User } from '../model/user.gen';
import { userBusinessDescriptor } from './user.descriptor';
import { Methods } from './user.gen';

export class UserBusiness implements Business<Methods> {
  static registered = false;
  static init() {
    if (!UserBusiness.registered) {
      const business: Business<Methods> = new UserBusiness();
      businessDirector.register(business, userBusinessDescriptor);
      UserBusiness.registered = true;
    }
  }

  private counter = 100;

  get(request: Request<Methods, 'get'>): Response<Methods, 'get'> {
    const user = userDao.init({ name: `user#${request.userId}` });
    // @ts-ignore
    user.entityId = request.userId;
    return { user };
  }
  create(request: Request<Methods, 'create'>): Response<Methods, 'create'> {
    const { user } = request;
    // @ts-ignore
    user.name += ' (saved)';
    // @ts-ignore
    return { user };
  }
  follow(request: Request<Methods, 'follow'>): Response<Methods, 'follow'> {
    const users: User[] = [];
    // @ts-ignore
    request.user.following = request.user.following ?? [];
    for (let i = 0; i < 1000; i++) {
      const user = userDao.init({ name: `user#${this.counter}` });
      // @ts-ignore
      user.entityId = `${this.counter++}`;
      users.push(user);
      // @ts-ignore
      request.user.following.push(user);
    }
    // @ts-ignore
    users.push(request.user);
    return { users };
  }
}
