import {
  Clz,
  decorateClz,
  DecorateClz,
  defineClz,
  DefineClz,
  nullClz,
} from './clz';

type AClz = DefineClz<'12.gaoshi', 'A', 0>;
const aClz: AClz = defineClz('12.gaoshi', 'A', 0);

type BClz = DefineClz<'12.gaoshi', 'B', 1>;
const bClz: BClz = defineClz('12.gaoshi', 'B', 1);

type CClz = DefineClz<'12.gaoshi', 'C', 2>;
const cClz: CClz = defineClz('12.gaoshi', 'C', 2);

it('defineClz', () => {
  expect(aClz).toEqual({
    package: '12.gaoshi',
    className: 'A',
    classCode: 0,
    next: nullClz,
  });
});

it('decorateClz', () => {
  const clz: DecorateClz<BClz, AClz> = decorateClz(bClz, aClz);
  expect({ ...clz, next: nullClz }).toEqual(bClz);
  expect(clz.next).toEqual(aClz);
});

it('deep decorateClz', () => {
  const clz: DecorateClz<DecorateClz<BClz, AClz>, CClz> = decorateClz(
    decorateClz(bClz, aClz),
    cClz
  );

  let res: Clz = clz;
  expect(res.className).toEqual('B');
  res = res.next;
  expect(res.className).toEqual('A');
  res = res.next;
  expect(res.className).toEqual('C');
});
