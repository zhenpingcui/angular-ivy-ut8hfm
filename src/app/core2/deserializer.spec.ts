import { defineClz, DefineClz } from './clz';
import { defineEntityTypes, DefineEntityTypes } from './core.classes';
import { deserialize } from './deserializer';
import { serialize } from './serializer';

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
    a: {
      type: 'string';
      tag: 3;
    };
    b: {
      type: AEnum;
      tag: 4;
    };
    c: {
      type: 'number';
      tag: 5;
      required: true;
    };
    d: {
      type: ['boolean'];
      tag: 6;
      readonly: true;
    };
    e: {
      type: {
        b_name: {
          type: 'string';
          tag: 0;
        };
      };
      tag: 7;
    };
    f: {
      type: [
        {
          b_name: {
            type: 'string';
            tag: 0;
          };
        }
      ];
      tag: 8;
    };
    g: {
      type: [AEnum];
      tag: 9;
    };
  }
>;
const types: Types = defineEntityTypes(aClz, {
  a: {
    type: 'string',
    tag: 3,
  },
  b: {
    type: aEnum,
    tag: 4,
  },
  c: {
    type: 'number',
    tag: 5,
    required: true,
  },
  d: {
    type: ['boolean'],
    tag: 6,
    readonly: true,
  },
  e: {
    type: {
      b_name: {
        type: 'string',
        tag: 0,
      },
    },
    tag: 7,
  },
  f: {
    type: [
      {
        b_name: {
          type: 'string',
          tag: 0,
        },
      },
    ],
    tag: 8,
  },
  g: {
    type: [aEnum],
    tag: 9,
  },
});

type A = Types['entity'];

const a: A = {
  entityType: 0,
  entityId: 'entityId',
  a: 'x',
  b: aEnum.one,
  c: 100,
  d: [true, false],
  e: { b_name: '' },
  f: [{ b_name: '' }],
  _clz: types.entity._clz,
};

const golden = {
  '0': 0,
  '1': 'entityId',
  '3': 'x',
  '4': 1,
  '5': 100,
  '6': [true, false],
  '7': { '0': '' },
  '8': [{ '0': '' }],
};

it('deserialize', () => {
  const proto = serialize(types.entityDescriptor, a);
  expect(deserialize(types.entityDescriptor, proto)).toEqual(a);
});

it('required primitive', () => {
  expect(() =>
    deserialize(types.entityDescriptor, {
      ...golden,
      5: undefined,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
  ).toThrowError();
});

it('non-undefined array member', () => {
  expect(() =>
    deserialize(types.entityDescriptor, {
      ...golden,
      8: [undefined],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
  ).toThrowError();
});

it('object mismatched (string)', () => {
  expect(() =>
    deserialize(types.entityDescriptor, {
      ...golden,
      7: 'string',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
  ).toThrowError();
});

it('object mismatched (array)', () => {
  expect(() =>
    deserialize(types.entityDescriptor, {
      ...golden,
      7: [],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
  ).toThrowError();
});

it('object mismatched (enum)', () => {
  expect(() =>
    deserialize(types.entityDescriptor, {
      ...golden,
      7: aEnum.one,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
  ).toThrowError();
});

it('array mismatched (object)', () => {
  expect(() =>
    deserialize(types.entityDescriptor, {
      ...golden,
      8: {},
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
  ).toThrowError();
});

it('array mismatched (primitive)', () => {
  expect(() =>
    deserialize(types.entityDescriptor, {
      ...golden,
      8: 1,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
  ).toThrowError();
});

it('primitive mismatched (primitive)', () => {
  expect(() =>
    deserialize(types.entityDescriptor, {
      ...golden,
      3: 123,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
  ).toThrowError();
});

it('enum mismatched (primitive)', () => {
  expect(() =>
    deserialize(types.entityDescriptor, {
      ...golden,
      4: 3,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
  ).toThrowError();
});

it('enum array mismatched (primitive)', () => {
  expect(() =>
    deserialize(types.entityDescriptor, {
      ...golden,
      9: [3],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
  ).toThrowError();
});

it('handle optional (primitive)', () => {
  const proto = serialize(types.entityDescriptor, { ...a, a: undefined });
  const entity = deserialize(types.entityDescriptor, proto);
  const expected = { ...a };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (expected as any)['a'];
  expect(entity).toEqual(entity);
});

it('handle optional (array)', () => {
  const proto = serialize(types.entityDescriptor, { ...a, d: undefined });
  const entity = deserialize(types.entityDescriptor, proto);
  const expected = { ...a };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (expected as any)['d'];
  expect(entity).toEqual(expected);
});
