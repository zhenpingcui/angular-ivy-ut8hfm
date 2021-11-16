import {
  Clz,
  ClzDescriptor,
  coreClasses,
  DefineEntityRefDescriptor,
  EnumDescriptor,
  FieldDescriptor,
  FieldsDescriptor,
  PrimitiveType,
  _clz,
  _core,
  _DefineEntityDescriptor,
} from './descriptor';
import { EntityRef, WithType } from './descriptor.mapping';

class EntityOperationsDirector {
  getEntityOperations(key: Clz): EntityOperations<any, any, any> {
    return {} as any;
  }
}
const entityOperationsDirector: EntityOperationsDirector =
  new EntityOperationsDirector();

export class EntityOperations<
  D extends _DefineEntityDescriptor<any> & FieldsDescriptor,
  E extends WithType<D>,
  ERef extends DefineEntityRefDescriptor<D>
> {
  constructor(private descriptor: D) {}
  addRevertLink(ref: DefineEntityRefDescriptor<any>): E {
    return {} as any;
  }
  removeRevertLink(ref: DefineEntityRefDescriptor<any>): E {
    return {} as any;
  }
  newRef(val: E): ERef {
    return {} as any;
  }
  safeWrite(original: E | undefined, update: E) {
    Object.keys(this.descriptor).forEach((k) => {
      const fieldDescriptor = this.descriptor[k];
      const value = update[k];
      const originalValue = original !== undefined ? original[k] : undefined;
      if (
        fieldDescriptor.readonly &&
        original !== undefined &&
        value !== originalValue
      ) {
        throw Error(`${JSON.stringify(original)}[${k}] is readonly.`);
      }
      if (fieldDescriptor.required && value === undefined) {
        throw Error(`${JSON.stringify(update)}[${k}] is missing.`);
      }
      if (Array.isArray(fieldDescriptor.type)) {
        this.safeWriteArray(
          original,
          originalValue,
          value,
          fieldDescriptor.type[0]
        );
      } else {
      }
    });
  }

  private safeWriteArray(
    oritinalE: E | undefined,
    original: Array<any> | undefined,
    update: Array<any> | undefined,
    descriptor: PrimitiveType | EnumDescriptor | FieldsDescriptor
  ) {
    if (!descriptor[_clz]) {
      return;
    }
    const clzDescriptor: ClzDescriptor = descriptor[_clz];
    const clz: Clz = clzDescriptor._clz.clz;
    if (clz.package !== _core || clz.classCode !== coreClasses.EntityRef) {
      return;
    }
    const operation = entityOperationsDirector.getEntityOperations(
      operationsKey(clz)
    );
    const originalRefs: Array<EntityRef> | undefined = original;
    const updateRefs: Array<EntityRef> | undefined = update;
    operation.removeRevertLink(this.newRef(oritinalE));
  }
}

function operationsKey(clz: Clz): Clz {
  if (clz.next === undefined) {
    return clz;
  } else {
    return operationsKey(clz.next);
  }
}
