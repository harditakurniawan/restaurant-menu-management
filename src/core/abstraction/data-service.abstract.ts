import { AccessToken } from '@database/entity/access-token.entity';
import { IGenericRepository } from './generic-repository.abstract';
import { User } from '@database/entity/user.entity';
import { Permission } from '@database/entity/permission.entity';
import { Role } from '@database/entity/role.entity';

export abstract class IDataService {
  abstract accessTokens   : IGenericRepository<AccessToken>;
  abstract permissions    : IGenericRepository<Permission>;
  abstract roles          : IGenericRepository<Role>;
  abstract users          : IGenericRepository<User>;
}
