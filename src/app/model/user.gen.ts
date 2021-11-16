import { DefineEntityDescriptor, DefineEntityRefDescriptor } from '../core';
import { SafeEnum } from '../core/descriptor';
import { AllEntities } from './all.entities.gen';
import { Safe, WithType } from './deps';

export type UserTypeDescriptor = SafeEnum<{
  classic: 0;
  premium: 1;
}>;
export type UserDescriptor = Safe<
  DefineEntityDescriptor<
    {
      package: 'my';
      className: 'user';
      classCode: 0;
    },
    {
      name: {
        tag: 2;
        type: 'string';
        required: true;
      };
      userType: {
        tag: 3;
        type: UserTypeDescriptor;
      };
      following: {
        tag: 4;
        type: [UserRefDescriptor];
      };
    }
  >
>;

export type UserRefDescriptor = DefineEntityRefDescriptor<UserDescriptor>;
export type User = WithType<UserDescriptor>;
let u: UserRefDescriptor;
export type UserRef = WithType<UserRefDescriptor>;
// u.following[0]._runtime.class
// let ref: UserRef;
// ref = u;
