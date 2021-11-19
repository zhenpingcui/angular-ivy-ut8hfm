import { defineClz, DefineClz } from './clz';
import { defineEntityTypes, DefineEntityTypes } from './core.classes';

type AClz = DefineClz<'12.gaoshi', 'A', 0>;
const aClz: AClz = defineClz('12.gaoshi', 'A', 0);
type AEnum = {
  one: 1;
  two: 2;
};
const aEnum: AEnum = {
  one: 1,
  two: 2,
};
type Types = DefineEntityTypes<
  AClz,
  {
    x: {
      type: 'string';
      tag: 0;
    };
    y: {
      type: AEnum;
      tag: 1;
    };
    z: {
      type: 'number';
      tag: 2;
      required: true;
    };
    a: {
      type: ['boolean'];
      tag: 3;
      readonly: true;
    };
    b: {
      type: {
        b_name: {
          type: 'string';
          tag: 0;
        };
      };
      tag: 4;
    };
  }
>;
type A = Types['entity'];
type ARef = Types['ref'];
type AWeakRef = Types['weakRef'];

const types: Types = defineEntityTypes(aClz, {
  x: {
    type: 'string',
    tag: 0,
  },
  y: {
    type: aEnum,
    tag: 1,
  },
  z: {
    type: 'number',
    tag: 2,
    required: true,
  },
  a: {
    type: ['boolean'],
    tag: 3,
    readonly: true,
  },
  b: {
    type: {
      b_name: {
        type: 'string',
        tag: 0,
      },
    },
    tag: 4,
  },
});

it('extends entity descriptor', () => {
  expect(types.entityDescriptor._clz.clz.className).toEqual('Entity');
  expect(types.entityDescriptor._clz.clz.next.className).toEqual('A');
});

it('extends ref descriptor', () => {
  expect(types.refDescriptor._clz.clz.className).toEqual('Ref');
});

it('extends weak ref descriptor', () => {
  expect(types.weakRefDescriptor._clz.clz.className).toEqual('WeakRef');
});

it('entity', () => {
  const a: A = {
    entityType: 0,
    entityId: '123',
    x: 'x',
    y: aEnum.one,
    z: 100,
    a: [true, false],
    b: { b_name: '' },
    _clz: types.entity._clz,
  };
  expect(a).toEqual({
    entityType: 0,
    entityId: '123',
    x: 'x',
    y: aEnum.one,
    z: 100,
    a: [true, false],
    b: { b_name: '' },
  });
});

it('ref', () => {
  const aRef: ARef = {
    entityType: 0,
    entityId: '123',
    _clz: types.ref._clz,
  };
  expect(aRef).toEqual({
    entityType: 0,
    entityId: '123',
  });
});

it('weak ref', () => {
  const aWeakRef: AWeakRef = {
    entityType: 0,
    entityId: '123',
    _clz: types.weakRef._clz,
  };
  expect(aWeakRef).toEqual({
    entityType: 0,
    entityId: '123',
  });
});
