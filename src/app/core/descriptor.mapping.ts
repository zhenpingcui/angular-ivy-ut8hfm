import {
  FieldsDescriptor,
  EnumDescriptor,
  FieldDescriptor,
  FieldDescriptorLite,
  FieldDescriptorLites,
  FieldOptions,
  FieldType,
  PrimitiveType,
  DefineClzDescriptor,
  ClzDescriptor,
  DecorateClzDescriptor,
  RawEntityRefDescriptor,
  Clz,
  ExtendsClzDescriptor,
  _DefineEntityDescriptor,
} from './descriptor';
import { DeepReadonly } from './util';

type ToType<Exp extends PrimitiveType> = Exp extends 'string'
  ? string
  : Exp extends 'number'
  ? number
  : Exp extends 'boolean'
  ? boolean
  : never;
type ToEnumType<T extends EnumDescriptor> = keyof {
  [p in keyof T as T[p]]: number;
};
type ToArrayType<
  ArrayT extends
    | Array<PrimitiveType>
    | Array<EnumDescriptor>
    | Array<FieldsDescriptor>
> = ToCompoundType<ArrayT[0]>[];

type ToCompoundType<T extends FieldType> = T extends
  | Array<FieldsDescriptor>
  | Array<PrimitiveType>
  | Array<EnumDescriptor>
  ? ToArrayType<T>
  : T extends FieldsDescriptor
  ? WithType<T>
  : T extends EnumDescriptor
  ? ToEnumType<T>
  : T extends PrimitiveType
  ? ToType<T>
  : never;

type FieldName<
  Name,
  FDescriptor extends FieldDescriptorLite,
  K extends keyof FieldOptions,
  Option extends boolean
> = K extends keyof FDescriptor // option set
  ? Option extends FDescriptor[K]
    ? Name
    : never
  : // option not set
  false extends Option
  ? Name
  : never;

type FieldName2<
  Name,
  FDescriptor extends FieldDescriptorLite,
  K1 extends keyof FieldOptions,
  Option1 extends boolean,
  K2 extends keyof FieldOptions,
  Option2 extends boolean
> = FieldName<
  FieldName<Name, FDescriptor, K1, Option1>,
  FDescriptor,
  K2,
  Option2
>;
type WithClz<D extends FieldDescriptorLites> = D extends ClzDescriptor
  ? { _clz: D['_clz']['clz'] }
  : { _clz?: any };
type _WithType<D extends FieldDescriptorLites> = {
  [p in keyof D as FieldName2<
    p,
    D[p],
    'required',
    false,
    'readonly',
    false
  >]+?: ToCompoundType<D[p]['type']>;
} & {
  [p in keyof D as FieldName2<
    p,
    D[p],
    'required',
    true,
    'readonly',
    false
  >]-?: ToCompoundType<D[p]['type']>;
} & {
  +readonly [p in keyof D as FieldName2<
    p,
    D[p],
    'required',
    false,
    'readonly',
    true
  >]+?: ToCompoundType<D[p]['type']>;
} & {
  +readonly [p in keyof D as FieldName2<
    p,
    D[p],
    'required',
    true,
    'readonly',
    true
  >]-?: ToCompoundType<D[p]['type']>;
};
export type WithType<D extends FieldDescriptorLites> = _WithType<
  Omit<D, keyof ClzDescriptor>
> &
  DeepReadonly<WithClz<D>>;

export type EntityLike = {
  readonly entityType: number;
  readonly entityId: string;
};
export type Proto = any;

// export function decorate<
//   Decorator extends ClzDescriptor,
//   T extends ClzDescriptor
// >(decorator: WithType<Decorator>, t: WithType<T>): WithType<DecorateClzDescriptor<Decorator, T>> {
//   return {
//     ...decorator,
//     ...defineClzDescriptor(decorateClz(decorator._clz.clz, t._clz.clz)),
//   };
// }

type ClzWithType = DeepReadonly<{
  _clz: Clz;
}>;
type Decorated<
  Decorator extends ClzDescriptor,
  T extends ClzWithType
> = WithType<ExtendsClzDescriptor<Decorator, T['_clz']>>;
export class DecoratorFactory<
  Decorator extends ClzDescriptor,
  T extends ClzWithType
> {
  create(t: T): Decorated<Decorator, T> | undefined {
    return;
  }
}

// Dao crete ref
export type EntityRef = RawEntityRefDescriptor;
export type Entity = WithType<_DefineEntityDescriptor<any>>;
export class EntityRefFactory extends DecoratorFactory<EntityRef, Entity> {}
export const entityRefFactory = new EntityRefFactory();
