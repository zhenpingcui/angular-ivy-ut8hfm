import { EntityLike } from './descriptor.mapping';
import { DeepReadonly } from './util';

export interface R {
  get<T>(entityType: number, entityId: string): DeepReadonly<T> | undefined;
}

export interface CRUD extends R {
  get<T>(entityType: number, entityId: string): T | undefined;
  insert<T extends EntityLike>(value: T): T;
  delete<T extends EntityLike>(value: T): T | undefined;
  update<T extends EntityLike>(value: T): T;
}
