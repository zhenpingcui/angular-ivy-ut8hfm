import { defineEntityDescriptor, defineEntityRefDescriptor } from './deps';
import {
  UserDescriptor,
  UserRefDescriptor,
  UserTypeDescriptor,
} from './user.gen';

const userKey = defineEntityDescriptor<{
  package: 'my';
  className: 'user';
  classCode: 0;
}>({
  package: 'my',
  className: 'user',
  classCode: 0,
});

export const userTypeDescriptor: UserTypeDescriptor = {
  classic: 0,
  premium: 1,
};
export const userRefDescriptor: UserRefDescriptor =
  defineEntityRefDescriptor(userKey);

console.log(userRefDescriptor);
export const userDescriptor: UserDescriptor = {
  ...defineEntityDescriptor({
    package: 'my',
    className: 'user',
    classCode: 0,
  }),
  name: {
    tag: 2,
    type: 'string',
    required: true,
  },
  userType: {
    tag: 3,
    type: userTypeDescriptor,
  },
  following: {
    tag: 4,
    type: [userRefDescriptor],
  },
};
