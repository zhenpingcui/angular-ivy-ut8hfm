export * from './business';
export * from './descriptor.mapping';
export * from './descriptor';
export * from './deserialize';
export * from './serialize';
export * from './dao';
export * from './app.cache';
export * from './util';

// insert<T>(value: T): T {
//   assert
//   this.store[key] = value;
//   this.notifyAll(key);
//   return value;
// }
// delete<T>(key: string): T | undefined {
//   const val = this.store[key];
//   delete this.store[key];
//   this.notifyAll(key);
//   return val;
// }
// update<T>(key: string, value: T): T {
//   if (this.store[key] === undefined) {
//     throw Error(`Update error: ${key} doesn't exist.`);
//   }
//   this.store[key] = value;
//   this.notifyAll(key);
//   return value;
// }
// get<T>(key: string): T | undefined {
//   return this.store[key];
// }
