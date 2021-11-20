import {
  FieldDescriptor,
  ObjectDescriptor,
  FieldType,
  isEnumDescriptor,
  PrimitiveType,
  EnumDescriptor,
} from './descriptors';

export interface Visitor {
  enterObject(
    fieldDescriptor?: FieldDescriptor,
    key?: string,
    tag?: number,
    idx?: number
  ): void;
  exitObject(): void;
  enterArray(
    fieldDescriptor?: FieldDescriptor,
    key?: string,
    tag?: number,
    idx?: number,
    type?: PrimitiveType | EnumDescriptor | ObjectDescriptor
  ): number;
  exitArray(): void;
  visitOptions(
    fieldDescriptor?: FieldDescriptor,
    key?: string,
    idx?: number,
    type?: PrimitiveType | EnumDescriptor | ObjectDescriptor
  ): boolean;
  visitPrimitive(
    fieldDescriptor?: FieldDescriptor,
    key?: string,
    idx?: number,
    type?: FieldType
  ): void;
  visitEnum(
    fieldDescriptor?: FieldDescriptor,
    key?: string,
    idx?: number,
    type?: FieldType
  ): void;
}

export class Traveler {
  constructor(private visitor: Visitor) {}

  travel(
    fields: ObjectDescriptor,
    fieldDescriptor?: FieldDescriptor,
    key?: string,
    tag?: number,
    idx?: number
  ) {
    const visitor = this.visitor;
    visitor.enterObject(fieldDescriptor, key, tag, idx);
    Object.keys(fields).forEach(k => {
      const fieldDescriptor = fields[k];
      this._travel(fieldDescriptor, k, fieldDescriptor.tag);
    });
    visitor.exitObject();
  }
  _travel(
    fieldDescriptor?: FieldDescriptor,
    key?: string,
    tag?: number,
    idx?: number,
    type?: PrimitiveType | EnumDescriptor | ObjectDescriptor
  ) {
    const visitor = this.visitor;
    const _continue = visitor.visitOptions(fieldDescriptor, key, idx, type);
    if (!_continue) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const typeX = (type ?? fieldDescriptor?.type)!;
    if (Array.isArray(typeX)) {
      const len = visitor.enterArray(fieldDescriptor, key, tag, idx, typeX[0]);
      for (let i = 0; i < len; i++) {
        this._travel(undefined, undefined, undefined, i, typeX[0]);
      }
      visitor.exitArray();
      return;
    }
    if (typeX === 'string' || typeX === 'number' || typeX === 'boolean') {
      visitor.visitPrimitive(fieldDescriptor, key, idx, type);
      return;
    }
    if (isEnumDescriptor(typeX)) {
      visitor.visitEnum(fieldDescriptor, key, idx, type);
      return;
    }
    this.travel(typeX as ObjectDescriptor, fieldDescriptor, key, tag, idx);
  }
}
