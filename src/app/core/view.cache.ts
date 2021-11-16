import { appCache, Subscription } from './app.cache';
import { R } from './crud';
import { DeepReadonly, topic } from './util';

export interface Disposable {
  dispose(): void;
}
export function loadData(onChange: (cache: R) => void): Disposable {
  return new ViewCache(onChange);
}
class ViewCache implements R, Disposable {
  private readonly subscribtion: Subscription;

  constructor(onChange: (cache: R) => void) {
    this.subscribtion = appCache.createSubscribtion(() => onChange(this));
    onChange(this);
  }
  get<T>(entityType: number, entityId: string): DeepReadonly<T> | undefined {
    const key = topic({ entityType, entityId });
    this.subscribtion.addKey(key);

    return appCache.get(entityType, entityId);
  }
  dispose() {
    this.subscribtion.dispose();
  }
}
