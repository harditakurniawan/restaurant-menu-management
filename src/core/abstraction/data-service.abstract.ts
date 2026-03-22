import { AccessToken } from '@database/entity/access-token.entity';
import { IGenericRepository } from './generic-repository.abstract';
import { User } from '@database/entity/user.entity';
import { Permission } from '@database/entity/permission.entity';
import { Role } from '@database/entity/role.entity';
import { Category } from '@database/entity/category.entity';
import { MenuItem } from '@database/entity/menu-item.entity';
import { Restaurant } from '@database/entity/restaurant.entity';

export abstract class IDataService {
  abstract accessTokens   : IGenericRepository<AccessToken>;
  abstract categories     : IGenericRepository<Category>;
  abstract menuItems      : IGenericRepository<MenuItem>;
  abstract permissions    : IGenericRepository<Permission>;
  abstract restaurants    : IGenericRepository<Restaurant>;
  abstract roles          : IGenericRepository<Role>;
  abstract users          : IGenericRepository<User>;
}
