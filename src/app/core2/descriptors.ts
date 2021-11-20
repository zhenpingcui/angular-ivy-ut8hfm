import { Clz } from './clz';

export type PrimitiveType = 'string' | 'number' | 'boolean';
export type EnumDescriptor = { [key: string]: number };

export type FieldType =
  | PrimitiveType
  | PrimitiveType[]
  | EnumDescriptor
  | EnumDescriptor[]
  | ObjectDescriptor
  | ObjectDescriptor[];
export type FieldOptions = {
  required?: boolean;
  readonly?: boolean;
  clz?: Clz;
  // Key for the system to trace change in an array.
  // a.k.a. unique key of memeber in an array.
  keys?: string[];
};

export type FieldDescriptor = {
  type: FieldType;
  tag: number;
} & FieldOptions;

export type FieldLiteDescriptor = Omit<FieldDescriptor, 'tag'>;
export type ObjectLiteDescriptor = {
  [key: string]: FieldLiteDescriptor;
};

export type ObjectDescriptor = {
  [key: string]: FieldDescriptor;
};

export function fieldByKeys(
  objectDescriptor: ObjectDescriptor,
  keys: string[],
  index = 0
): FieldDescriptor {
  if (keys.length - 1 === index) {
    return objectDescriptor[keys[index]];
  }
  return fieldByKeys(
    objectDescriptor[keys[index]].type as ObjectDescriptor,
    keys,
    index + 1
  );
}

export function valueByKeys(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
  keys?: string[],
  index = 0
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  if (value === undefined) {
    return undefined;
  }
  if (keys === undefined) {
    return value;
  }
  if (keys.length - 1 === index) {
    return value[keys[index]];
  }
  return valueByKeys(value[keys[index]], keys, index + 1);
}

export function isEnumDescriptor(
  descriptor: EnumDescriptor | ObjectDescriptor
): boolean {
  return typeof Object.values(descriptor)[0] === 'number';
}
