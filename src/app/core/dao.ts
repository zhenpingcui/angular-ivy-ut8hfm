import { assert } from './assert';
import { CRUD, R } from './crud';
import {
  _DefineEntityDescriptor,
  RawEntityDescriptor,
  Clz,
} from './descriptor';
import { Proto, EntityLike, WithType } from './descriptor.mapping';
import { deserialize } from './deserialize';
import { serialize } from './serialize';
import { DeepReadonly } from './util';

export type DefineDao<
  D extends _DefineEntityDescriptor<any>,
  E = WithType<D>
> = E extends WithType<D> & EntityLike ? Dao<D, E, D['_clz']['clz']> : never;
export function defineDao<
  D extends _DefineEntityDescriptor<any>,
  E extends WithType<D> & EntityLike
>(descriptor: D): Dao<D, E, D['_clz']['clz']> {
  return new Dao<D, E, D['_clz']['clz']>(descriptor);
}

// Use composition
/*



MyDao implements SafeMyDao, Basic Dao {
  raw: RawDao
}


*/
// RawDao
export class Dao<
  D extends _DefineEntityDescriptor<C>,
  E extends WithType<D> & EntityLike,
  C extends Clz
> {
  constructor(private readonly descriptor: D) {}
  init(init: Omit<E, keyof RawEntityDescriptor>, entityId?: string): E {
    console.log(this.descriptor);
    const res = init as E;
    // @ts-ignore
    res.entityType = this.descriptor._clz.clz.next.classCode; // TODO
    // @ts-ignore
    res.entityId = entityId ?? '';
    return res;
  }
  insert(value: E, ctx: CRUD): E {
    return ctx.insert(value);
  }
  delete(value: E, ctx: CRUD): E | undefined {
    return ctx.delete(value);
  }
  update(value: E, ctx: CRUD): E {
    return ctx.update(value);
  }
  get(entityId: string, ctx: R): DeepReadonly<E> | undefined {
    return ctx.get(this.descriptor._clz.clz.next.classCode as any, entityId);
  }
  serialize(value: E): Proto {
    return serialize(value as any, this.descriptor);
  }
  deserialize(proto: Proto): E {
    return deserialize(proto, this.descriptor) as unknown as E;
  }

  // ref related function
}
/*
DAO -> TypeOps
三类方法
Readonly
get: DeepReadonly<E>

Raw
serrialize
deseralize
getForWrite: E = WithType<D>
createRef: Ref<E>
createWeak: Ref<Weak>
init:
delete

Safe
getForSafeWrite: SafeWritable<E, CustomizeBanList>
safeInit, init(SafeWritable<Omit<E, ...>, CustomizeBanList>)
delete // Customized ban
Should forbid ref copying
Raw
 */

/*
It seems we need a serviece layer to handle 'unsafe' operation. e.g.

  const safeUser: SafeUser = {
    ...input,
    supportingTeams: { // ban writing, 
      supportRate:
      team: countryDao.makeRef(country) ban writing
    }[]
  }

  init = {
    name: 'chris',
    supportingTeams: [{
      supportRate: 123
      team: teamDao.makeRef(team),
    }]
  }
PeopleService init(input: SafeInit<User>, teams: {supportRate, team: ref /* init * readonly}) {
  const user: User = {
    ...input,
    supportingTeams: {
      supportRate:
      team: countryDao.makeRef(country)
    }[]
  }
  userDao.insert(user);
  country.using.push(...);
  country.update(country);
},



// Rever connection be manage automatically,
// add
// remove
family -> people ->team

initPeople(
  team: teams.makeRef
)
family.Members.push(perope.makeRef)

function init(...) {
  const topicPresent
  const user: User = {
    name: ..,
    supportingTeams: {}
      supportRate: ...
      [safe=true] team: countryRefHelper.makeRef(topicPresent, country) [safe= true] // complicate, could stil copy

      team: countryRefHelper.makeRef(topicPresent, original, country) // not allow init out side, but copy ok.
    }[]
  }
  userDao.insert(user, topicPresent, ctx);
  userDao.makeRef(version, user)
}
ctx.flush();

function update(...) {
  const topicPresent
  const user = userDao.getWritable(...);
  user.team = countryRefHelper.makeRef(topicPresent, original, country);..
  user.update(user);
  countryRefHelper.flush()
}

function delete() {
  countryRefHelper.makeRef(topicPresent, original, undefined);
  delete;
}
*/

// Pay special attention to memory allocation.

// var ans = [1..1000] inited
// var ans = []
// for (int i; i< 1000000; i++) ans[i]=i;
