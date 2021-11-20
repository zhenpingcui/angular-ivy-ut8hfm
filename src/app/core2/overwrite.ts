import { keyBy, union } from 'lodash';
import { Clz } from './clz';
import { clzOfField, clzOfObject, _clz } from './clz.field';
import {
  entityId,
  entityType,
  isInstanceOf,
  normailzeKey,
} from './core.classes';
import {
  FieldDescriptor,
  ObjectDescriptor,
  FieldType,
  PrimitiveType,
  EnumDescriptor,
  isEnumDescriptor,
  fieldByKeys,
  valueByKeys,
} from './descriptors';
import { ToType } from './to.type';
import { Traveler, Visitor } from './traveler';

type Delta = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  original: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  current: any;
};

export enum Operation {
  connect = 0,
  disconnect = 1,
}
export type FollowUp = {
  operation: Operation;
  entityType: number;
  entityId: string;
};

class VisitorImpl implements Visitor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private deltas: (Delta | Delta[])[] = [];
  followups: FollowUp[] = [];
  private top: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private original: any, private current: any) {
    this.top = -1;
  }

  enterObject(
    fieldDescriptor?: FieldDescriptor,
    key?: string,
    tag?: number,
    idx?: number
  ): void {
    this.top++;
    if (this.top === 0) {
      this.deltas[this.top] = {
        original: this.original,
        current: this.current,
      };
      return;
    }
    const lastDelta = this.deltas[this.top - 1];
    if (Array.isArray(lastDelta)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.deltas[this.top] = lastDelta[idx!];
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      key = key!;
      this.deltas[this.top] = {
        original: lastDelta.original && lastDelta.original[key],
        current: lastDelta.current && lastDelta.current[key],
      };
    }
  }
  enterArray(
    fieldDescriptor?: FieldDescriptor,
    key?: string,
    tag?: number,
    idx?: number,
    type?: PrimitiveType | EnumDescriptor | ObjectDescriptor
  ): number {
    this.top++;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    type = type!;
    if (
      type === 'string' ||
      type == 'number' ||
      type === 'boolean' ||
      isEnumDescriptor(type)
    ) {
      this.deltas[this.top] = [];
      return 0;
    }
    type = type as ObjectDescriptor;
    let clz: Clz | undefined = undefined;
    const keys = fieldDescriptor?.keys;
    if (keys) {
      clz = clzOfField(fieldByKeys(type, keys));
    } else {
      clz = clzOfObject(type);
    }

    const lastDelta = this.deltas[this.top - 1] as Delta;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    key = key!;
    let originals = lastDelta.original && lastDelta.original[key];
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    originals = (originals ?? []) as any[];
    let currents = lastDelta.current && lastDelta.current[key];
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    currents = (currents ?? []) as any[];

    const originalsByKey = keyBy(originals, (e) => normailzeKey(e, keys, clz));
    const currentsByKey = keyBy(currents, (e) => normailzeKey(e, keys, clz));
    const allKey = union(
      Object.keys(originalsByKey),
      Object.keys(currentsByKey)
    );
    const deltas: Delta[] = [];
    allKey.forEach((key) => {
      const delta: Delta = {
        original: originalsByKey[key],
        current: currentsByKey[key],
      };
      deltas.push(delta);
    });
    this.deltas[this.top] = deltas;
    return deltas.length;
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
    idx?: number,
    type?: PrimitiveType | EnumDescriptor | ObjectDescriptor
  ): boolean {
    const delta = this.get(key, idx);
    if (delta.current === undefined && delta.original === undefined) {
      return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    let typeX = type ?? fieldDescriptor!.type;
    if (Array.isArray(typeX)) {
      return true;
    }
    if (
      typeX === 'string' ||
      typeX == 'number' ||
      typeX === 'boolean' ||
      isEnumDescriptor(typeX)
    ) {
      return true;
    }
    typeX = typeX as ObjectDescriptor;
    const keys = fieldDescriptor?.keys;
    let clz: Clz | undefined = undefined;
    if (keys) {
      clz = clzOfField(fieldByKeys(typeX, keys));
    } else {
      clz = clzOfObject(typeX);
    }
    if (isInstanceOf(clz, 'Ref')) {
      const originalRef = valueByKeys(delta.original, keys);
      const currentRef = valueByKeys(delta.current, keys);
      if (delta.original === delta.current) {
        return true;
      }
      if (delta.original !== undefined) {
        this.followups.push({
          operation: Operation.disconnect,
          entityId: originalRef[entityId],
          entityType: originalRef[entityType],
        });
      }
      if (delta.current !== undefined) {
        this.followups.push({
          operation: Operation.connect,
          entityId: currentRef[entityId],
          entityType: currentRef[entityType],
        });
      }
      return true;
    }
    return true;
  }

  visitPrimitive(
    fieldDescriptor?: FieldDescriptor,
    key?: string,
    idx?: number,
    type?: FieldType
  ): void {
    return;
  }
  visitEnum(
    fieldDescriptor?: FieldDescriptor,
    key?: string,
    idx?: number,
    type?: FieldType
  ): void {
    return;
  }
  private get(key?: string, idx?: number): Delta {
    if (key !== undefined) {
      const delta = this.deltas[this.top] as Delta;
      return {
        original: delta.original && delta.original[key],
        current: delta.current && delta.current[key],
      };
    }
    idx = idx as number;
    const deltas = this.deltas[this.top] as Delta[];
    return deltas[idx];
  }
}

export function overwrite<D extends ObjectDescriptor>(
  descriptor: D,
  original?: ToType<D>,
  current?: ToType<D>
): FollowUp[] {
  const visitor = new VisitorImpl(original, current);
  const traveler = new Traveler(visitor);
  traveler.travel(descriptor);
  return visitor.followups;
}
