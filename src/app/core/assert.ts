export function assert<T>(val: T): T {
  if (!val) throw Error('NPE');
  return val;
}

export function assertTrue<T>(val: boolean) {
  if (!val) throw Error('Wrong assertion');
}
