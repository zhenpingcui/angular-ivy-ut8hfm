export type Clz = {
  package: string;
  className: string;
  classCode: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next: any;
};
type NullClz = {
  package: '';
  className: '';
  classCode: -1;
};
export const nullClz: NullClz = {
  package: '',
  className: '',
  classCode: -1,
};
export type DefineClz<
  Package extends string,
  ClassName extends string,
  ClassCode extends number
> = _DefineClz<Package, ClassName, ClassCode, NullClz>;

export type _DefineClz<
  Package extends string,
  ClassName extends string,
  ClassCode extends number,
  C
> = {
  package: Package;
  className: ClassName;
  classCode: ClassCode;
  next: C;
};
export function defineClz<
  Package extends string,
  ClassName extends string,
  ClassCode extends number
>(
  _package: Package,
  className: ClassName,
  classCode: ClassCode
): DefineClz<Package, ClassName, ClassCode> {
  return _defineClz(_package, className, classCode, nullClz);
}
function _defineClz<
  Package extends string,
  ClassName extends string,
  ClassCode extends number,
  C
>(
  _package: Package,
  className: ClassName,
  classCode: ClassCode,
  c: C
): _DefineClz<Package, ClassName, ClassCode, C> {
  return {
    package: _package,
    className: className,
    classCode: classCode,
    next: c,
  };
}
export type DecorateClz<Decorator extends Clz, C extends Clz> = _DefineClz<
  Decorator['package'],
  Decorator['className'],
  Decorator['classCode'],
  NullClz extends Decorator['next']
    ? C
    : Decorator['next'] extends Clz
    ? DecorateClz<Decorator['next'], C>
    : never
>;

export function decorateClz<Decorator extends Clz, C extends Clz>(
  decorator: Decorator,
  c: C
): DecorateClz<Decorator, C> {
  return {
    ...decorator,
    next: decorator.next?.classCode === -1 ? c : decorateClz(decorator.next, c),
  };
}
