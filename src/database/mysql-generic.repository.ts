import { InsertResult, QueryRunner, Repository, SelectQueryBuilder, UpdateResult } from 'typeorm';
import { IGenericRepository } from '@core-abstraction/generic-repository.abstract';
import { Utils } from '@utils/utils.service';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class MySQLGenericRepository<T> implements IGenericRepository<T> {
  private _repository: Repository<T>;
  private _relationOnFind: string[];
  private _utils: Utils;

  constructor(repository: Repository<T>, relationOnFind: string[] = []) {
    this._repository = repository;
    this._relationOnFind = relationOnFind;
    this._utils = new Utils();
  }

  public count = (payload: any): Promise<number> => this._repository.count(payload);

  public createEntity = (payload: any): T[] => this._repository.create(payload);

  public createQueryBuilder = (alias?: string, queryRunner?: QueryRunner): SelectQueryBuilder<T> => this._repository.createQueryBuilder(alias, queryRunner);

  public deleteMany = (payload: Array<any>) => this._repository.remove(payload);

  public deleteOne = (condition: object) => this._repository.delete(condition);

  public find = (condition: object): Promise<T[]> => this._repository.find(condition);

  public findOne = (condition: object): Promise<T> => {
    const query = { ...condition, withDeleted: true };

    return this._repository.findOne(query);
  };

  public findAndCount = (condition: object): Promise<any> => {
    return this._repository.findAndCount(condition);
  }
  
  public findOneBy = (condition: object): Promise<T> => this._repository.findOneBy(condition);

  public getAll = (payloadQueryParam: any = {}): Promise<T[]> => {
    const query = { ...payloadQueryParam, withDeleted: true };

    return this._repository.find(query);
  };

  public insertMany = (payload: Array<object>): Promise<InsertResult> => this._repository.insert(payload);

  public isExist = async (condition: object): Promise<boolean> => {
    const data = await this._repository.findOne({ where: condition });

    const isExist: boolean = this._utils.isNull(data) ? false : true;

    return isExist;
  };

  public merge = async (existingDate: any, dataWillBeMerge: any): Promise<any> => {
    return this._repository.merge(existingDate, dataWillBeMerge)
  }

  public queryBuilder = (tableName: string): SelectQueryBuilder<T> => this._repository.createQueryBuilder(tableName);

  public rawQuery = (query: string | any) => this._repository.query(query);

  public restoreSoftDelete = (id: string | number) => this._repository.restore(id);

  public save = (payload: any): Promise<T> => this._repository.save(payload);

  public softDelete = (id: string | number) => this._repository.softDelete(id);

  public update = (condition: object, payload: object): Promise<UpdateResult> => this._repository.update(condition, payload);

  public updateOrCreate = (payload: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[], overwrite: Array<string>) => this._repository.upsert(payload, overwrite);
}
