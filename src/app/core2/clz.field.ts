import { Clz, decorateClz, DecorateClz } from './clz';
import {
  FieldDescriptor,
  ObjectDescriptor,
  isEnumDescriptor,
} from './descriptors';

export const _clz = '_clz';
export type ClzField = {
  _clz: {
    tag: -1;
    type: 'string';
    clz?: Clz;
  };
};

export type DefineClzField<C extends Clz> = {
  _clz: {
    tag: -1;
    type: 'string';
    clz: C;
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithClzField = DefineClzField<any>;
export type _Clz<T extends WithClzField> = T['_clz']['clz'];

export function defineClzField<C extends Clz>(clz: C): DefineClzField<C> {
  return {
    _clz: {
      tag: -1,
      type: 'string',
      clz,
    },
  };
}
export type Decorate<
  Decorator extends WithClzField,
  T extends WithClzField
> = DefineClzField<DecorateClz<_Clz<Decorator>, _Clz<T>>> &
  Omit<Decorator, keyof ClzField>;

export function decorate<
  Decorator extends WithClzField,
  T extends WithClzField
>(decorator: Decorator, t: T): Decorate<Decorator, T> {
  return {
    ...decorator,
    ...defineClzField(decorateClz(decorator._clz.clz, t._clz.clz)),
  };
}

export type Extendz<C extends Clz, Super extends WithClzField> = DefineClzField<
  DecorateClz<_Clz<Super>, C>
> &
  Omit<Super, keyof ClzField>;

export function extendz<C extends Clz, Super extends WithClzField>(
  c: C,
  _super: Super
): Extendz<C, Super> {
  return {
    ..._super,
    ...defineClzField(decorateClz(_super._clz.clz, c)),
  };
}

export function clzOfObject(descriptor: ObjectDescriptor): Clz | undefined {
  return descriptor[_clz]?.clz;
}

export function clzOfField(descriptor: FieldDescriptor): Clz | undefined {
  const typeX = descriptor.type;
  if (Array.isArray(typeX)) {
    return undefined;
  }
  if (typeof typeX !== 'object') {
    return undefined;
  }
  if (isEnumDescriptor(typeX)) {
    return undefined;
  }
  return clzOfObject(typeX as ObjectDescriptor);
}
