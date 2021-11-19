import { Clz, defineClz, DefineClz } from './clz';
import {
  decorate,
  Decorate,
  defineClzField,
  DefineClzField,
  extendz,
  Extendz,
} from './clz.field';
import { FieldsDescriptor } from './fields';
import { ToType } from './to.type';

type _Core = 'core';
const _core = 'core';

type CoreClasses = {
  Entity: 0;
  Ref: 1;
  WeakRef: 2;
};
const coreClasses: CoreClasses = {
  Entity: 0,
  Ref: 1,
  WeakRef: 2,
};

type DefineCoreClzField<Name extends keyof CoreClasses> = DefineClzField<
  DefineClz<_Core, Name, CoreClasses[Name]>
>;

function defineCoreClzField<Name extends keyof CoreClasses>(
  name: Name
): DefineClzField<DefineClz<_Core, Name, CoreClasses[Name]>> {
  return defineClzField(defineClz(_core, name, coreClasses[name]));
}

type EntityDescriptor = DefineCoreClzField<'Entity'> & {
  entityType: {
    tag: 0;
    type: 'number';
    required: true;
    readonly: true;
  };
  entityId: {
    tag: 1;
    type: 'string';
    required: true;
    readonly: true;
  };
};
const entityDescriptor: EntityDescriptor = {
  ...defineCoreClzField('Entity'),
  entityType: {
    tag: 0,
    type: 'number',
    required: true,
    readonly: true,
  },
  entityId: {
    tag: 1,
    type: 'string',
    required: true,
    readonly: true,
  },
};

type RefDescriptor = DefineCoreClzField<'Ref'> & {
  entityType: {
    tag: 0;
    type: 'number';
    required: true;
    readonly: true;
  };
  entityId: {
    tag: 1;
    type: 'string';
    required: true;
    readonly: true;
  };
};

const refDescriptor: RefDescriptor = {
  ...defineCoreClzField('Ref'),
  entityType: {
    tag: 0,
    type: 'number',
    required: true,
    readonly: true,
  },
  entityId: {
    tag: 1,
    type: 'string',
    required: true,
    readonly: true,
  },
};

type WeakRefDescriptor = DefineCoreClzField<'WeakRef'> & {
  entityType: {
    tag: 0;
    type: 'number';
    required: true;
    readonly: true;
  };
  entityId: {
    tag: 1;
    type: 'string';
    required: true;
    readonly: true;
  };
};

const weakRefDescriptor: WeakRefDescriptor = {
  ...defineCoreClzField('WeakRef'),
  entityType: {
    tag: 0,
    type: 'number',
    required: true,
    readonly: true,
  },
  entityId: {
    tag: 1,
    type: 'string',
    required: true,
    readonly: true,
  },
};

export type DefineEntityTypes<
  C extends Clz,
  Fields extends FieldsDescriptor
> = {
  entityDescriptor: _EntityDescriptor<C, Fields>;
  refDescriptor: _RefDescriptor<C, Fields>;
  weakRefDescriptor: _WeakRefDescriptor<C, Fields>;
  entity: _Entity<C, Fields>;
  ref: _Ref<C, Fields>;
  weakRef: _WeakRef<C, Fields>;
};

type _EntityDescriptor<
  C extends Clz,
  Fields extends FieldsDescriptor
> = Extendz<C, EntityDescriptor> & Fields;
type _RefDescriptor<C extends Clz, Fields extends FieldsDescriptor> = Decorate<
  RefDescriptor,
  _EntityDescriptor<C, Fields>
>;
type _WeakRefDescriptor<
  C extends Clz,
  Fields extends FieldsDescriptor
> = Decorate<WeakRefDescriptor, _EntityDescriptor<C, Fields>>;
type _Entity<C extends Clz, Fields extends FieldsDescriptor> = ToType<
  _EntityDescriptor<C, Fields>
>;
type _Ref<C extends Clz, Fields extends FieldsDescriptor> = ToType<
  _RefDescriptor<C, Fields>
>;
type _WeakRef<C extends Clz, Fields extends FieldsDescriptor> = ToType<
  _WeakRefDescriptor<C, Fields>
>;

export function defineEntityTypes<
  C extends Clz,
  Fields extends FieldsDescriptor
>(c: C, fields: Fields): DefineEntityTypes<C, Fields> {
  return {
    entityDescriptor: _entityDescriptor(c, fields),
    refDescriptor: _refDescriptor(c, fields),
    weakRefDescriptor: _weakRefDescriptor(c, fields),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    entity: {} as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: {} as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    weakRef: {} as any,
  };
}

function _entityDescriptor<C extends Clz, Fields extends FieldsDescriptor>(
  c: C,
  fields: Fields
): _EntityDescriptor<C, Fields> {
  return { ...extendz(c, entityDescriptor), ...fields };
}
function _refDescriptor<C extends Clz, Fields extends FieldsDescriptor>(
  c: C,
  fields: Fields
): _RefDescriptor<C, Fields> {
  return decorate(refDescriptor, _entityDescriptor(c, fields));
}
function _weakRefDescriptor<C extends Clz, Fields extends FieldsDescriptor>(
  c: C,
  fields: Fields
): _WeakRefDescriptor<C, Fields> {
  return decorate(weakRefDescriptor, _entityDescriptor(c, fields));
}
