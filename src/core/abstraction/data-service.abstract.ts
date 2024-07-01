import { AccessToken } from '@database/entity/access-token.entity';
import { IGenericRepository } from './generic-repository.abstract';
import { User } from '@database/entity/user.entity';

export abstract class IDataService {
  abstract accessTokens: IGenericRepository<AccessToken>;
  abstract users: IGenericRepository<User>;
}
