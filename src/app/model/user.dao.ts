import { Dao, defineDao, DefineDao } from './deps';
import { userDescriptor } from './user.descriptor';
import { User, UserDescriptor } from './user.gen';

// class UserDao extends DefineDao<UserDescriptor> {
//   // customized dao methods go here.
// }

export const userDao = defineDao(userDescriptor);
