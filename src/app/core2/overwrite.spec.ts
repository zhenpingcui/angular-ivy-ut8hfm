import { defineClz, DefineClz } from './clz';
import { defineEntityTypes, DefineEntityTypes } from './core.classes';
import { Operation, overwrite } from './overwrite';

type AClz = DefineClz<'12.gaoshi', 'A', 0>;
const aClz: AClz = defineClz('12.gaoshi', 'A', 0);
type ATypes = DefineEntityTypes<
  AClz,
  {
    name: {
      type: 'string';
      tag: 3;
    };
  }
>;
const aTypes: ATypes = defineEntityTypes(aClz, {
  name: {
    type: 'string',
    tag: 3,
  },
});

type BClz = DefineClz<'12.gaoshi', 'B', 0>;
const bClz: BClz = defineClz('12.gaoshi', 'B', 0);
type BFields = {
  aRef: {
    type: ATypes['refDescriptor'];
    tag: 3;
  };
  aRefs: {
    type: [ATypes['refDescriptor']];
    tag: 4;
  };
  aRelation: {
    type: {
      ref: {
        type: ATypes['refDescriptor'];
        tag: 0;
      };
    };
    tag: 6;
  };
  aRelations: {
    type: [
      {
        ref: {
          type: ATypes['refDescriptor'];
          tag: 0;
        };
      }
    ];
    keys: ['ref'];
    tag: 5;
  };
};

type BTypes = DefineEntityTypes<BClz, BFields>;
const bTypes: BTypes = defineEntityTypes(bClz, {
  aRef: {
    type: aTypes.refDescriptor,
    tag: 3,
  },
  aRefs: {
    type: [aTypes.refDescriptor],
    tag: 4,
  },
  aRelation: {
    type: {
      ref: {
        type: aTypes['refDescriptor'],
        tag: 0,
      },
    },
    tag: 6,
  },
  aRelations: {
    type: [
      {
        ref: {
          type: aTypes['refDescriptor'],
          tag: 0,
        },
      },
    ],
    keys: ['ref'],
    tag: 5,
  },
});

type B = BTypes['entity'];
const aRef1: ATypes['ref'] = {
  entityId: '001',
  entityType: 0,
  _clz: aTypes.ref._clz,
};
const aRef2: ATypes['ref'] = {
  entityId: '002',
  entityType: 0,
  _clz: aTypes.ref._clz,
};
const aRef3: ATypes['ref'] = {
  entityId: '003',
  entityType: 0,
  _clz: aTypes.ref._clz,
};

it('connect one ref', () => {
  const original: B = {
    entityType: 1,
    entityId: '00b',
    _clz: bTypes.entity._clz,
  };
  const current: B = {
    entityType: 1,
    entityId: '00b',
    aRef: aRef1,
    _clz: bTypes.entity._clz,
  };
  const followups = overwrite(bTypes.entityDescriptor, original, current);
  expect(followups).toEqual([{ operation: Operation.connect, ...aRef1 }]);
});

it('disconnet one ref', () => {
  const original: B = {
    entityType: 1,
    entityId: '00b',
    aRef: aRef1,
    _clz: bTypes.entity._clz,
  };
  const current: B = {
    entityType: 1,
    entityId: '00b',
    _clz: bTypes.entity._clz,
  };
  const followups = overwrite(bTypes.entityDescriptor, original, current);
  expect(followups).toEqual([{ operation: Operation.disconnect, ...aRef1 }]);
});

it('replace one ref', () => {
  const original: B = {
    entityType: 1,
    entityId: '00b',
    aRef: aRef1,
    _clz: bTypes.entity._clz,
  };
  const current: B = {
    entityType: 1,
    entityId: '00b',
    aRef: aRef2,
    _clz: bTypes.entity._clz,
  };
  const followups = overwrite(bTypes.entityDescriptor, original, current);
  expect(followups).toEqual([
    { operation: Operation.disconnect, ...aRef1 },
    { operation: Operation.connect, ...aRef2 },
  ]);
});

it('keep one ref', () => {
  const original: B = {
    entityType: 1,
    entityId: '00b',
    aRef: aRef1,
    _clz: bTypes.entity._clz,
  };
  const current: B = {
    entityType: 1,
    entityId: '00b',
    aRef: aRef1,
    _clz: bTypes.entity._clz,
  };
  const followups = overwrite(bTypes.entityDescriptor, original, current);
  expect(followups).toEqual([]);
});

it('connect one relation', () => {
  const original: B = {
    entityType: 1,
    entityId: '00b',
    _clz: bTypes.entity._clz,
  };
  const current: B = {
    entityType: 1,
    entityId: '00b',
    aRelation: { ref: aRef1 },
    _clz: bTypes.entity._clz,
  };
  const followups = overwrite(bTypes.entityDescriptor, original, current);
  expect(followups).toEqual([{ operation: Operation.connect, ...aRef1 }]);
});

it('disconnet one relation', () => {
  const original: B = {
    entityType: 1,
    entityId: '00b',
    aRelation: { ref: aRef1 },
    _clz: bTypes.entity._clz,
  };
  const current: B = {
    entityType: 1,
    entityId: '00b',
    _clz: bTypes.entity._clz,
  };
  const followups = overwrite(bTypes.entityDescriptor, original, current);
  expect(followups).toEqual([{ operation: Operation.disconnect, ...aRef1 }]);
});

it('replace one relation', () => {
  const original: B = {
    entityType: 1,
    entityId: '00b',
    aRelation: { ref: aRef1 },
    _clz: bTypes.entity._clz,
  };
  const current: B = {
    entityType: 1,
    entityId: '00b',
    aRelation: { ref: aRef2 },
    _clz: bTypes.entity._clz,
  };
  const followups = overwrite(bTypes.entityDescriptor, original, current);
  expect(followups).toEqual([
    { operation: Operation.disconnect, ...aRef1 },
    { operation: Operation.connect, ...aRef2 },
  ]);
});

it('keep one relation', () => {
  const original: B = {
    entityType: 1,
    entityId: '00b',
    aRelation: { ref: aRef1 },
    _clz: bTypes.entity._clz,
  };
  const current: B = {
    entityType: 1,
    entityId: '00b',
    aRelation: { ref: aRef1 },
    _clz: bTypes.entity._clz,
  };
  const followups = overwrite(bTypes.entityDescriptor, original, current);
  expect(followups).toEqual([]);
});

it('connect three refs', () => {
  const original: B = {
    entityType: 1,
    entityId: '00b',
    _clz: bTypes.entity._clz,
  };
  const current: B = {
    entityType: 1,
    entityId: '00b',
    aRefs: [aRef1, aRef2, aRef3],
    _clz: bTypes.entity._clz,
  };
  const followups = overwrite(bTypes.entityDescriptor, original, current);
  expect(followups).toEqual([
    { operation: Operation.connect, ...aRef1 },
    { operation: Operation.connect, ...aRef2 },
    { operation: Operation.connect, ...aRef3 },
  ]);
});

it('disconnect three refs', () => {
  const original: B = {
    entityType: 1,
    entityId: '00b',
    aRefs: [aRef1, aRef2, aRef3],
    _clz: bTypes.entity._clz,
  };
  const current: B = {
    entityType: 1,
    entityId: '00b',
    _clz: bTypes.entity._clz,
  };
  const followups = overwrite(bTypes.entityDescriptor, original, current);
  expect(followups).toEqual([
    { operation: Operation.disconnect, ...aRef1 },
    { operation: Operation.disconnect, ...aRef2 },
    { operation: Operation.disconnect, ...aRef3 },
  ]);
});

it('replace some refs', () => {
  const original: B = {
    entityType: 1,
    entityId: '00b',
    aRefs: [aRef1, aRef2],
    _clz: bTypes.entity._clz,
  };
  const current: B = {
    entityType: 1,
    entityId: '00b',
    aRefs: [aRef2, aRef3],
    _clz: bTypes.entity._clz,
  };
  const followups = overwrite(bTypes.entityDescriptor, original, current);
  expect(followups).toEqual([
    { operation: Operation.disconnect, ...aRef1 },
    { operation: Operation.connect, ...aRef3 },
  ]);
});

it('connect three refs, handle empty refs', () => {
  const original: B = {
    entityType: 1,
    entityId: '00b',
    aRefs: [],
    _clz: bTypes.entity._clz,
  };
  const current: B = {
    entityType: 1,
    entityId: '00b',
    aRefs: [aRef1, aRef2, aRef3],
    _clz: bTypes.entity._clz,
  };
  const followups = overwrite(bTypes.entityDescriptor, original, current);
  expect(followups).toEqual([
    { operation: Operation.connect, ...aRef1 },
    { operation: Operation.connect, ...aRef2 },
    { operation: Operation.connect, ...aRef3 },
  ]);
});

it('disconnect three refs, handle empty refs', () => {
  const original: B = {
    entityType: 1,
    entityId: '00b',
    aRefs: [aRef1, aRef2, aRef3],
    _clz: bTypes.entity._clz,
  };
  const current: B = {
    entityType: 1,
    entityId: '00b',
    aRefs: [],
    _clz: bTypes.entity._clz,
  };
  const followups = overwrite(bTypes.entityDescriptor, original, current);
  expect(followups).toEqual([
    { operation: Operation.disconnect, ...aRef1 },
    { operation: Operation.disconnect, ...aRef2 },
    { operation: Operation.disconnect, ...aRef3 },
  ]);
});

it('create three relations', () => {
  const original: B = {
    entityType: 1,
    entityId: '00b',
    _clz: bTypes.entity._clz,
  };
  const current: B = {
    entityType: 1,
    entityId: '00b',
    aRelations: [{ ref: aRef1 }, { ref: aRef2 }, { ref: aRef3 }],
    _clz: bTypes.entity._clz,
  };
  const followups = overwrite(bTypes.entityDescriptor, original, current);
  expect(followups).toEqual([
    { operation: Operation.connect, ...aRef1 },
    { operation: Operation.connect, ...aRef2 },
    { operation: Operation.connect, ...aRef3 },
  ]);
});

it('remove three relations', () => {
  const original: B = {
    entityType: 1,
    entityId: '00b',
    aRelations: [{ ref: aRef1 }, { ref: aRef2 }, { ref: aRef3 }],
    _clz: bTypes.entity._clz,
  };
  const current: B = {
    entityType: 1,
    entityId: '00b',
    _clz: bTypes.entity._clz,
  };
  const followups = overwrite(bTypes.entityDescriptor, original, current);
  expect(followups).toEqual([
    { operation: Operation.disconnect, ...aRef1 },
    { operation: Operation.disconnect, ...aRef2 },
    { operation: Operation.disconnect, ...aRef3 },
  ]);
});

it('replace some relations', () => {
  const original: B = {
    entityType: 1,
    entityId: '00b',
    aRelations: [{ ref: aRef1 }, { ref: aRef2 }],
    _clz: bTypes.entity._clz,
  };
  const current: B = {
    entityType: 1,
    entityId: '00b',
    aRelations: [{ ref: aRef2 }, { ref: aRef3 }],

    _clz: bTypes.entity._clz,
  };
  const followups = overwrite(bTypes.entityDescriptor, original, current);
  expect(followups).toEqual([
    { operation: Operation.disconnect, ...aRef1 },
    { operation: Operation.connect, ...aRef3 },
  ]);
});

it('insert, connect one ref', () => {
  const current: B = {
    entityType: 1,
    entityId: '00b',
    aRef: aRef1,
    _clz: bTypes.entity._clz,
  };
  const followups = overwrite(bTypes.entityDescriptor, undefined, current);
  expect(followups).toEqual([{ operation: Operation.connect, ...aRef1 }]);
});

it('insert, connect three refs', () => {
  const current: B = {
    entityType: 1,
    entityId: '00b',
    aRefs: [aRef1, aRef2, aRef3],
    _clz: bTypes.entity._clz,
  };
  const followups = overwrite(bTypes.entityDescriptor, undefined, current);
  expect(followups).toEqual([
    { operation: Operation.connect, ...aRef1 },
    { operation: Operation.connect, ...aRef2 },
    { operation: Operation.connect, ...aRef3 },
  ]);
});

it('insert, create three relations', () => {
  const current: B = {
    entityType: 1,
    entityId: '00b',
    aRelations: [{ ref: aRef1 }, { ref: aRef2 }, { ref: aRef3 }],
    _clz: bTypes.entity._clz,
  };
  const followups = overwrite(bTypes.entityDescriptor, undefined, current);
  expect(followups).toEqual([
    { operation: Operation.connect, ...aRef1 },
    { operation: Operation.connect, ...aRef2 },
    { operation: Operation.connect, ...aRef3 },
  ]);
});

it('delete, disconnect one ref', () => {
  const original: B = {
    entityType: 1,
    entityId: '00b',
    aRef: aRef1,
    _clz: bTypes.entity._clz,
  };
  const followups = overwrite(bTypes.entityDescriptor, original, undefined);
  expect(followups).toEqual([{ operation: Operation.disconnect, ...aRef1 }]);
});

it('delete, disconnect three refs', () => {
  const original: B = {
    entityType: 1,
    entityId: '00b',
    aRefs: [aRef1, aRef2, aRef3],
    _clz: bTypes.entity._clz,
  };
  const followups = overwrite(bTypes.entityDescriptor, original, undefined);
  expect(followups).toEqual([
    { operation: Operation.disconnect, ...aRef1 },
    { operation: Operation.disconnect, ...aRef2 },
    { operation: Operation.disconnect, ...aRef3 },
  ]);
});

it('delete, remove three relations', () => {
  const original: B = {
    entityType: 1,
    entityId: '00b',
    aRelations: [{ ref: aRef1 }, { ref: aRef2 }, { ref: aRef3 }],
    _clz: bTypes.entity._clz,
  };
  const followups = overwrite(bTypes.entityDescriptor, original, undefined);
  expect(followups).toEqual([
    { operation: Operation.disconnect, ...aRef1 },
    { operation: Operation.disconnect, ...aRef2 },
    { operation: Operation.disconnect, ...aRef3 },
  ]);
});
