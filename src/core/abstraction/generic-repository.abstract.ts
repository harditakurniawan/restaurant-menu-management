import { QueryRunner,InsertResult, SelectQueryBuilder, UpdateResult } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

export abstract class IGenericRepository<T> {
  abstract count(payload: object): Promise<number>;
  abstract createEntity(payload: object): T[];
  abstract createQueryBuilder(alias?: string, queryRunner?: QueryRunner): SelectQueryBuilder<T>;
  abstract deleteMany(payload: Array<any>);
  abstract deleteOne(condition: object);
  abstract find(condition: object): Promise<T[]>;
  abstract findOne(condition: object): Promise<T>;
  abstract findAndCount(condition: object): Promise<any>;
  abstract findOneBy(condition: object): Promise<T>;
  abstract getAll(condition?: object): Promise<T[]>;
  abstract insertMany(payload: Array<object>): Promise<InsertResult>;
  abstract isExist(condition?: object): Promise<boolean>;
  abstract merge(existingDate: any, dataWillBeMerge: any): Promise<any>;
  abstract queryBuilder(tableName: string): SelectQueryBuilder<T>;
  abstract rawQuery(query: string | any): any;
  abstract restoreSoftDelete(id: string | number): any;
  abstract save(payload: object): Promise<T>;
  abstract softDelete(id: string | number): any;
  abstract update(condition: object, payload: object): Promise<UpdateResult>;
  abstract updateOrCreate(payload: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[], overwrite: Array<string>);
}