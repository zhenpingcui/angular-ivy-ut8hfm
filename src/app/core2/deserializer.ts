import { includes } from 'lodash';
import { _clz } from './clz.field';
import {
  EnumDescriptor,
  FieldDescriptor,
  ObjectDescriptor,
  FieldType,
} from './descriptors';
import { Proto, ToType } from './to.type';
import { Traveler, Visitor } from './traveler';

class VisitorImpl implements Visitor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private paramStack: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private resStack: any[] = [];
  private top: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private value: any) {
    this.top = -1;
  }

  enterObject(
    fieldDescriptor?: FieldDescriptor,
    key?: string,
    tag?: number,
    idx?: number
  ): void {
    this.enter(key, tag, idx, {});
    const param = this.paramStack[this.top];
    if (typeof param !== 'object' || Array.isArray(param)) {
      throw new Error('Object type miss matched.');
    }
  }
  enterArray(
    fieldDescriptor?: FieldDescriptor,
    key?: string,
    tag?: number,
    idx?: number
  ): number {
    const len = this.enter(key, tag, idx, []);
    const param = this.paramStack[this.top];
    if (!Array.isArray(param)) {
      throw new Error('Array type miss matched.');
    }
    return len;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private enter(key?: string, tag?: number, idx?: number, init?: any): number {
    this.top++;
    const curRes = init;
    this.resStack[this.top] = curRes;
    if (this.top > 0) {
      const lastParam = this.paramStack[this.top - 1];
      const lastRes = this.resStack[this.top - 1];
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const keyOrIdx = (key ?? idx)!;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const tagOrIdx = (tag ?? idx)!;
      lastRes[keyOrIdx] = curRes;
      this.paramStack[this.top] = lastParam[tagOrIdx];
    } else {
      this.paramStack[this.top] = this.value;
    }
    const curParam = this.paramStack[this.top];
    if (Array.isArray(curParam)) {
      return curParam.length;
    }
    return 0;
  }
  exitObject(): void {
    this.top--;
  }
  exitArray() {
    this.top--;
  }

  visitOptions(
    fieldDescriptor?: FieldDescriptor,
    key?: string,
    idx?: number
  ): boolean {
    const valueX = this.get(fieldDescriptor?.tag, idx);
    if (
      key !== undefined &&
      fieldDescriptor?.required &&
      valueX === undefined
    ) {
      throw new Error('Missing required field ' + key);
    }
    if (idx !== undefined && valueX == undefined) {
      throw new Error('Can not have undefined in array ');
    }
    return valueX !== undefined;
  }
  visitPrimitive(
    fieldDescriptor?: FieldDescriptor,
    key?: string,
    idx?: number,
    type?: FieldType
  ): void {
    const valueX = this.get(fieldDescriptor?.tag, idx);
    if (typeof valueX !== (type ?? fieldDescriptor?.type)) {
      throw new Error('Primitive type mismatch.');
    }
    this.set(key, idx, valueX);
  }
  visitEnum(
    fieldDescriptor?: FieldDescriptor,
    key?: string,
    idx?: number,
    type?: FieldType
  ): void {
    const valueX = this.get(fieldDescriptor?.tag, idx);
    const enumDescriptor = (type ?? fieldDescriptor?.type) as EnumDescriptor;
    if (!includes(Object.values(enumDescriptor), valueX)) {
      throw new Error('Enum type mismatch.');
    }
    this.set(key, idx, valueX);
  }
  private get(tag?: number, idx?: number) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const tagOrIdx = (tag ?? idx)!;
    return this.paramStack[this.top][tagOrIdx];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private set(key?: string, idx?: number, val?: any) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const keyOrIdx = (idx ?? key)!;
    return (this.resStack[this.top][keyOrIdx] = val);
  }

  get result() {
    return this.resStack[0];
  }
}

export function deserialize<D extends ObjectDescriptor>(
  descriptor: D,
  value: Proto
): ToType<D> {
  const visitor = new VisitorImpl(value);
  const traveler = new Traveler(visitor);
  traveler.travel(descriptor);
  return visitor.result;
}
