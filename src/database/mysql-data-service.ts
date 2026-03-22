import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { MySQLGenericRepository } from './mysql-generic.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessToken } from './entity/access-token.entity';
import { User } from './entity/user.entity';
import { IDataService } from '@core-abstraction/data-service.abstract';
import { Permission } from './entity/permission.entity';
import { Role } from './entity/role.entity';
import { Category } from './entity/category.entity';
import { MenuItem } from './entity/menu-item.entity';
import { Restaurant } from './entity/restaurant.entity';

@Injectable()
export class MySQLDataService implements IDataService, OnApplicationBootstrap
{
  accessTokens  : MySQLGenericRepository<AccessToken>;
  categories    : MySQLGenericRepository<Category>;
  menuItems     : MySQLGenericRepository<MenuItem>;
  permissions   : MySQLGenericRepository<Permission>;
  restaurants   : MySQLGenericRepository<Restaurant>;
  roles         : MySQLGenericRepository<Role>;
  users         : MySQLGenericRepository<User>;

  constructor(
    @InjectRepository(AccessToken) private accessTokenRepository  : Repository<AccessToken>,
    @InjectRepository(Category) private categoryRepository        : Repository<Category>,
    @InjectRepository(MenuItem) private menuItemRepository        : Repository<MenuItem>,
    @InjectRepository(Permission) private permissionRepository    : Repository<Permission>,
    @InjectRepository(Restaurant) private restaurantRepository    : Repository<Restaurant>,
    @InjectRepository(Role) private roleRepository                : Repository<Role>,
    @InjectRepository(User) private userRepository                : Repository<User>,
  ) {}

  onApplicationBootstrap() {
    this.accessTokens   = new MySQLGenericRepository<AccessToken>(this.accessTokenRepository);
    this.categories     = new MySQLGenericRepository<Category>(this.categoryRepository);
    this.menuItems      = new MySQLGenericRepository<MenuItem>(this.menuItemRepository);
    this.permissions    = new MySQLGenericRepository<Permission>(this.permissionRepository);
    this.restaurants    = new MySQLGenericRepository<Restaurant>(this.restaurantRepository);
    this.roles          = new MySQLGenericRepository<Role>(this.roleRepository);
    this.users          = new MySQLGenericRepository<User>(this.userRepository);
  }
}
