import { WithType } from '../core';
import { userDescriptor } from '../model/user.descriptor';
import { UserDescriptor } from '../model/user.gen';

export type CommonInputs = {
  userId: {
    type: 'string';
  };
  user: {
    type: UserDescriptor;
  };
  users: {
    type: [UserDescriptor];
  };
};

export const commonInputs: CommonInputs = {
  userId: {
    type: 'string',
  },
  user: {
    type: userDescriptor,
  },
  users: {
    type: [userDescriptor],
  },
};

export type CommonInput = WithType<CommonInputs>;
