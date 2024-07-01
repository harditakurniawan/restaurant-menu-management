import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { MySQLGenericRepository } from './mysql-generic.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessToken } from './entity/access-token.entity';
import { User } from './entity/user.entity';
import { IDataService } from '@core-abstraction/data-service.abstract';
import { Permission } from './entity/permission.entity';
import { Role } from './entity/role.entity';

@Injectable()
export class MySQLDataService implements IDataService, OnApplicationBootstrap
{
  accessTokens  : MySQLGenericRepository<AccessToken>;
  permissions   : MySQLGenericRepository<Permission>;
  roles         : MySQLGenericRepository<Role>;
  users         : MySQLGenericRepository<User>;

  constructor(
    @InjectRepository(AccessToken) private accessTokenRepository  : Repository<AccessToken>,
    @InjectRepository(Permission) private permissionRepository    : Repository<Permission>,
    @InjectRepository(Role) private roleRepository                : Repository<Role>,
    @InjectRepository(User) private userRepository                : Repository<User>,
  ) {}

  onApplicationBootstrap() {
    this.accessTokens   = new MySQLGenericRepository<AccessToken>(this.accessTokenRepository);
    this.permissions    = new MySQLGenericRepository<Permission>(this.permissionRepository);
    this.roles          = new MySQLGenericRepository<Role>(this.roleRepository);
    this.users          = new MySQLGenericRepository<User>(this.userRepository);
  }
}
