import { IGenericRepository } from "./generic-repository.abstract";

export abstract class IDataService {
  abstract getCollectionNames(): string[];
  
  // abstract accessTokens   : IGenericRepository<AccessToken>;
  // abstract cronLogs       : IGenericRepository<CronLog>;
  // abstract users          : IGenericRepository<User>;
}