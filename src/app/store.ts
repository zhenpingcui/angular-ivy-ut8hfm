export const globalStore: { [key: string]: any } = {};
export const localStore: { [key: string]: any } = {};

export function update(data: number) {
  const kv = data % 3;
  globalStore[kv] = data;
  if (kv === 0) {
    localStore[kv] = data;
    if (gcb) {
      gcb();
    }
  }
}
let gcb: () => void;
export function subscribe(cb: () => void) {
  gcb = cb;
}
