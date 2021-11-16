type _Core = 'core';
export const _core = 'core';

type CoreClasses = SafeEnum<{
  Entity: 0;
  EntityRef: 1;
}>;
export const coreClasses: CoreClasses = {
  Entity: 0,
  EntityRef: 1,
};
type DefineCoreClz<Name extends keyof CoreClasses> = DefineClz<
  _Core,
  Name,
  CoreClasses[Name],
  undefined
>;
function coreClass<K extends keyof CoreClasses>(k: K): DefineCoreClz<K> {
  return defineClz(_core, k, coreClasses[k], undefined);
}
export type Clz = {
  package: string;
  className: string;
  classCode: number;
  next?: Clz;
};
export type DefineClz<
  Package extends string,
  ClassName extends string,
  ClassCode extends number,
  Clz
> = {
  package: Package;
  className: ClassName;
  classCode: ClassCode;
  next?: Clz;
};
export function defineClz<
  Package extends string,
  ClassName extends string,
  ClassCode extends number,
  Clz
>(
  _package: Package,
  className: ClassName,
  classCode: ClassCode,
  clz: Clz
): DefineClz<Package, ClassName, ClassCode, Clz> {
  return {
    package: _package,
    className: className,
    classCode: classCode,
    next: clz,
  };
}
type DecorateClz<Decorator extends Clz, T extends Clz> = DefineClz<
  Decorator['package'],
  Decorator['className'],
  Decorator['classCode'],
  undefined extends Decorator['next'] ? T : DecorateClz<Decorator['next'], T>
>;

function decorateClz<Decorator extends Clz, T extends Clz>(
  decorator: Decorator,
  t: T
) {
  return {
    ...decorator,
    next: decorator.next ? decorateClz(decorator.next, t) : t,
  };
}

export const _clz = '_clz';
export type ClzDescriptor = {
  _clz: {
    tag: -1;
    type: 'string';
    clz?: any;
  };
};

export type DefineClzDescriptor<C extends Clz> = {
  _clz: {
    tag: -1;
    type: 'string';
    clz?: C;
  };
};

function defineClzDescriptor<C extends Clz>(clz: C): DefineClzDescriptor<C> {
  return {
    _clz: {
      tag: -1,
      type: 'string',
      clz,
    },
  };
}
export type DecorateClzDescriptor<
  Decorator extends ClzDescriptor,
  T extends ClzDescriptor
> = DefineClzDescriptor<
  DecorateClz<Decorator['_clz']['clz'], T['_clz']['clz']>
> &
  Omit<Decorator, keyof ClzDescriptor>;

function decorateClzDescriptor<
  Decorator extends ClzDescriptor,
  T extends ClzDescriptor
>(decorator: Decorator, t: T): DecorateClzDescriptor<Decorator, T> {
  return {
    ...decorator,
    ...defineClzDescriptor(decorateClz(decorator._clz.clz, t._clz.clz)),
  };
}

export type ExtendsClzDescriptor<
  Super extends ClzDescriptor,
  C extends Clz
> = DefineClzDescriptor<DecorateClz<Super['_clz']['clz'], C>> &
  Omit<Super, keyof ClzDescriptor>;

export function extendsClzDescriptor<
  Super extends ClzDescriptor,
  C extends Clz
>(_super: Super, c: C): ExtendsClzDescriptor<Super, C> {
  return {
    ..._super,
    ...defineClzDescriptor(decorateClz(_super._clz.clz, c)),
  };
}
export type RawEntityDescriptor = DefineClzDescriptor<
  DefineCoreClz<'Entity'>
> & {
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
const rawEntityDescriptor: RawEntityDescriptor = {
  ...defineClzDescriptor(coreClass('Entity')),
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

export type _DefineEntityDescriptor<C extends Clz> = ExtendsClzDescriptor<
  RawEntityDescriptor,
  C
>;

export type DefineEntityDescriptor<
  C extends Clz,
  Fields extends FieldsDescriptor
> = _DefineEntityDescriptor<C> & Fields;

export function defineEntityDescriptor<C extends Clz>(
  clz: C
): ExtendsClzDescriptor<RawEntityDescriptor, C> {
  return extendsClzDescriptor(rawEntityDescriptor, clz);
}

export type RawEntityRefDescriptor = DefineClzDescriptor<
  DefineCoreClz<'EntityRef'>
> & {
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

const rawEntityRefDescriptor: RawEntityRefDescriptor = {
  ...defineClzDescriptor(coreClass('EntityRef')),
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

export type DefineEntityRefDescriptor<
  EntityDescriptor extends _DefineEntityDescriptor<any>
> = DecorateClzDescriptor<RawEntityRefDescriptor, EntityDescriptor>;

export function defineEntityRefDescriptor<
  EntityDescriptor extends _DefineEntityDescriptor<any>
>(
  entityDescriptor: EntityDescriptor
): DefineEntityRefDescriptor<EntityDescriptor> {
  return decorateClzDescriptor(rawEntityRefDescriptor, entityDescriptor);
}

export type PrimitiveType = 'string' | 'number' | 'boolean';
// TODO: make it class
export type EnumDescriptor = { [key: string]: number };

export type FieldType =
  | PrimitiveType
  | PrimitiveType[]
  | EnumDescriptor
  | EnumDescriptor[]
  | FieldsDescriptor
  | FieldsDescriptor[];
export type FieldOptions = {
  required?: boolean;
  readonly?: boolean;
};

export type FieldsDescriptor = {
  [key: string]: FieldDescriptor;
};
export type FieldDescriptor = {
  type: FieldType;
  tag: number;
} & FieldOptions;

// FieldDescriptorLite could be used to define ParamRepo
export type FieldDescriptorLite = {
  type: FieldType;
};
export type FieldDescriptorLites = {
  [key: string]: FieldDescriptorLite;
};
export type Param<
  ParamRepo extends FieldDescriptorLites,
  Key extends keyof ParamRepo,
  Tag extends number,
  Required extends boolean = false
> = { [p in Key]: ParamRepo[p] & { tag: Tag; required: Required } };

export function param<
  ParamRepo extends FieldDescriptorLites,
  K extends keyof ParamRepo,
  Tag extends number,
  Required extends boolean = false
>(
  templates: ParamRepo,
  k: K,
  tag: Tag,
  required: Required
): Param<ParamRepo, K, Tag, Required> {
  const res: Param<ParamRepo, K, Tag, Required> = {} as any;
  res[k] = {} as any;
  res[k].type = templates[k].type;
  res[k].tag = tag;
  res[k].required = required;
  return res;
}

type ByTagDescriptor<Fields extends FieldsDescriptor> = {
  [p in keyof Fields as Fields[p]['tag']]: p;
};
type Passed = 'passed';
type TagDuplicated = 'tag duplicated';
type CheckResult = Passed | TagDuplicated;
type CheckTagDuplication<
  ByKeys extends FieldsDescriptor,
  ByTags extends ByTagDescriptor<ByKeys>
> = {
  [p in keyof ByKeys]: ByTags[ByKeys[p]['tag']] extends p
    ? Passed
    : TagDuplicated;
};
type ChekAllPass<
  Descriptor,
  T extends { [key: string]: CheckResult }
> = T extends { [key: string]: Passed } ? Descriptor : T;

export type Safe<Descriptor extends FieldsDescriptor> = ChekAllPass<
  Descriptor,
  CheckTagDuplication<Descriptor, ByTagDescriptor<Descriptor>>
>;

type ByEnumValueDescriptor<Members extends EnumDescriptor> = {
  [p in keyof Members as Members[p]]: p;
};
type CheckEnumValueDuplication<
  ByKeys extends EnumDescriptor,
  ByTags extends ByEnumValueDescriptor<ByKeys>
> = {
  [p in keyof ByKeys]: ByTags[ByKeys[p]] extends p ? Passed : TagDuplicated;
};
export type SafeEnum<Descriptor extends EnumDescriptor> = ChekAllPass<
  Descriptor,
  CheckEnumValueDuplication<Descriptor, ByEnumValueDescriptor<Descriptor>>
>;
// {
//   [p in keyof Descriptor]: Descriptor[p]['type'] extends Array<any>
//     ? {
//         type: Descriptor[p]['type'][0] extends FieldsDescriptor
//           ? Safe<Descriptor[p]['type'][0]>[]
//           : Descriptor[p]['type'];
//       }
//     : Descriptor[p]['type'] extends FieldsDescriptor
//     ? {
//         type: Safe<Descriptor[p]['type']>;
//       }
//     : Descriptor[p];
// } & ChekAllPass<
//   Descriptor,
//   CheckTagDuplication<Descriptor, ByTagDescriptor<Descriptor>>
// >;

/** Utils */
export function isFieldsDescriptor(
  descriptor: FieldsDescriptor | EnumDescriptor
): boolean {
  return typeof Object.values(descriptor)[0] === 'object';
}
export function isValidEnumValue(
  val: number,
  descriptor: EnumDescriptor
): boolean {
  return Object.values(descriptor).findIndex((e) => e === val) !== -1;
}
