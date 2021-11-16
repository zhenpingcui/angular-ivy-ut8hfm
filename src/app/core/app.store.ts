import Dexie, { Table } from 'dexie';
import { APP_STORE, ENTITY } from './constant';
import { CRUD } from './crud';
import { Entity, topic } from './entity';

class AppDB extends Dexie {
  constructTable: Table<Entity, string>;

  constructor() {
    super(APP_STORE);
    this.version(1).stores({
      [ENTITY]: `,entity`,
    });
    this.constructTable = this.table(ENTITY);
  }

  async loadEntities(): Promise<[string, Entity][]> {
    const entities: Entity[] = await this.constructTable.toArray();
    return entities.map((entity) => [topic(entity), entity]);
  }
}

const db = new AppDB();

class AppStore implements CRUD {
  insert<T extends Entity>(value: T): T {
    
    throw new Error('Method not implemented.');
  }
  delete<T extends Entity>(value: T): T {
    throw new Error('Method not implemented.');
  }
  update<T extends Entity>(value: T): T {
    throw new Error('Method not implemented.');
  }
  get<T>(ref: Entity): T {
    throw new Error('Method not implemented.');
  }
}
