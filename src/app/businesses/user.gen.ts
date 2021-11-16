import { Param } from '../core';
import { UserDescriptor } from '../model/user.gen';
import { CommonInputs } from './params';

export type Methods = {
  create: {
    request: Param<CommonInputs, 'user', 0, true>;
    response: {
      user: {
        tag: 0;
        type: UserDescriptor;
        required: true;
      };
    };
    tag: 0;
  };
  get: {
    request: Param<CommonInputs, 'userId', 0, true>;
    response: {
      user: {
        tag: 0;
        type: UserDescriptor;
        required: true;
      };
    };
    tag: 1;
  };
  follow: {
    request: Param<CommonInputs, 'user', 0, true>;
    response: {
      users: {
        tag: 0;
        type: [UserDescriptor];
        required: true;
      };
    };
    tag: 2;
  };
};
