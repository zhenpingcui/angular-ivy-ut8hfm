import { WithClzField, _Clz } from './clz.field';
import {
  EnumDescriptor,
  FieldLiteDescriptor,
  ObjectLiteDescriptor,
  FieldOptions,
  ObjectDescriptor,
  FieldType,
  PrimitiveType,
} from './descriptors';

type ToSimpleType<Exp extends PrimitiveType> = Exp extends 'string'
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
    | Array<ObjectDescriptor>
> = ToCompoundType<ArrayT[0]>[];

type ToCompoundType<T extends FieldType> = T extends
  | Array<ObjectDescriptor>
  | Array<PrimitiveType>
  | Array<EnumDescriptor>
  ? ToArrayType<T>
  : T extends ObjectDescriptor
  ? ToType<T>
  : T extends EnumDescriptor
  ? ToEnumType<T>
  : T extends PrimitiveType
  ? ToSimpleType<T>
  : never;

type FieldName<
  Name,
  FDescriptor extends FieldLiteDescriptor,
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
  FDescriptor extends FieldLiteDescriptor,
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
type WithClz<D extends ObjectLiteDescriptor> = D extends WithClzField
  ? { _clz: _Clz<D> }
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { _clz?: any };
type _ToType<D extends ObjectLiteDescriptor> = {
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
export type ToType<D extends ObjectLiteDescriptor> = _ToType<
  Omit<D, keyof WithClzField>
> &
  WithClz<D>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Proto = any;
