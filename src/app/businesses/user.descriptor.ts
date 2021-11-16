import { businessDescriptor, param } from '../core';
import { userDescriptor } from '../model/user.descriptor';
import { allBusinesses } from './all.businesses';
import { commonInputs } from './params';
import { Methods } from './user.gen';

const methods: Methods = {
  create: {
    request: {
      ...param(commonInputs, 'user', 0, true),
    },
    response: {
      user: {
        tag: 0,
        type: userDescriptor,
        required: true,
      },
    },
    tag: 0,
  },
  get: {
    request: {
      ...param(commonInputs, 'userId', 0, true),
    },
    response: {
      user: {
        tag: 0,
        type: userDescriptor,
        required: true,
      },
    },
    tag: 1,
  },
  follow: {
    request: { ...param(commonInputs, 'user', 0, true) },
    response: {
      users: {
        tag: 0,
        type: [userDescriptor],
        required: true,
      },
    },
    tag: 2,
  },
};
export const userBusinessDescriptor = businessDescriptor(
  allBusinesses,
  'user',
  methods
);
