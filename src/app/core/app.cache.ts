import { R } from './crud';
import { EntityLike } from './descriptor.mapping';
import { DeepReadonly, topic } from './util';

export type OnChange = () => void;
type OnDispose = () => void;

export class Subscription {
  keys: { [key: string]: boolean } = {};
  private scheduled = false;
  private disposed = false;
  constructor(
    private onChange: OnChange,
    private onAddKey: (key: string) => void,
    private onDispose: OnDispose
  ) {}

  addKey(key: string) {
    if (!this.keys[key]) {
      this.keys[key] = true;
      this.onAddKey(key);
    }
  }
  scheduleChange() {
    if (this.scheduled) return;
    this.scheduled = true;
    Promise.resolve().then(() => {
      if (this.disposed) return;
      this.onChange();
      this.scheduled = false;
    });
  }
  dispose(): void {
    this.disposed = true;
    this.onDispose();
  }
}

export class AppCache implements R {
  private subscriptions: { [key: number]: Subscription } = {};
  private subscriptionsByKey: { [key: string]: { [key: number]: boolean } } =
    {};
  private subscriptionCounter: number = 0;
  private store: { [key: string]: any } = {};

  createSubscribtion(onChange: OnChange): Subscription {
    const id = this.subscriptionCounter;
    const subscription = new Subscription(
      onChange,
      (key) => {
        this.subscriptionsByKey[key] = this.subscriptionsByKey[key] ?? {};
        this.subscriptionsByKey[key][id] = true;
      },
      () => {
        Object.keys(this.subscriptions[id].keys).forEach((key) => {
          delete this.subscriptionsByKey[key][id];
        });
        delete this.subscriptions[id];
      }
    );
    this.subscriptions[id] = subscription;
    this.subscriptionCounter++;
    return subscription;
  }

  upsert<T extends EntityLike>(value: T): T {
    const key = topic(value);
    this.store[key] = value;
    this.notifyAll(key);
    return value;
  }
  get<T>(entityType: number, entityId: string): DeepReadonly<T> | undefined {
    const key = topic({ entityType, entityId });
    return this.store[key];
  }

  private notifyAll(key: string): void {
    Object.keys(this.subscriptionsByKey[key] ?? {}).forEach((id) => {
      const subscription = this.subscriptions[id];
      subscription.scheduleChange();
    });
  }
}
export const appCache: AppCache = new AppCache();
