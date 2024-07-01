import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { MySQLGenericRepository } from './mysql-generic.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessToken } from './entity/access-token.entity';
import { User } from './entity/user.entity';
import { IDataService } from '@core-abstraction/data-service.abstract';

@Injectable()
export class MySQLDataService implements IDataService, OnApplicationBootstrap
{
  accessTokens: MySQLGenericRepository<AccessToken>;
  users: MySQLGenericRepository<User>;

  constructor(
    @InjectRepository(AccessToken) private accessTokenRepository: Repository<AccessToken>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  onApplicationBootstrap() {
    this.accessTokens = new MySQLGenericRepository<AccessToken>(this.accessTokenRepository);
    this.users = new MySQLGenericRepository<User>(this.userRepository);
  }
}
