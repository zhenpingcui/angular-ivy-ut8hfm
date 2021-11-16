import { EntityLike } from './descriptor.mapping';

export type DeepReadonly<T> = {
  +readonly [p in keyof T]: DeepReadonly<T[p]>;
};

type SafeWritableArray<
  T,
  BanWriting,
  NeedSafe extends boolean
> = T extends Array<any>
  ? (_SafeWritable<T[0], BanWriting> &
      (true extends NeedSafe ? { banWriting: true } : {}))[]
  : T extends object
  ? _SafeWritable<T, BanWriting> &
      (true extends NeedSafe ? { banWriting: true } : {})
  : T;
type _SafeWritable<T, BanWriting> = {
  [p in keyof T as T[p] extends BanWriting ? never : p]: SafeWritableArray<
    T[p],
    BanWriting,
    false
  >;
} & {
  +readonly [p in keyof T as T[p] extends BanWriting
    ? p
    : never]: SafeWritableArray<T[p], BanWriting, true>;
};

// Support customized banlist
type SafeWritable<T, BanWriting> = _SafeWritable<T, BanWriting | BanWriting[]>;

export type Ref = {
  _type: 'Ref';
};

export type WeakRef = {
  _type: 'WeakRef';
};

export type Foo = {
  a: string;
  readonly b: string;
  c: Ref;
  readonly d: Ref;
  e: WeakRef;
  readonly f: WeakRef;
  g: {
    a: Ref;
    b: WeakRef[];
  };
  h: Ref[];
  i: {
    name?: string;
    ref: Ref;
  }[];
};
export type Bar = SafeWritable<Foo, Ref | WeakRef>;
// let foo: Foo;
// let bar: Bar;

// bar.i.push({ ref: foo.c });
export function topic(entity: EntityLike) {
  return `${entity.entityType}#${entity.entityId}`;
}
