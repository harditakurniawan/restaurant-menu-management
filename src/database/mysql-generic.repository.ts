import { Repository } from 'typeorm';
import { IGenericRepository } from '@core-abstraction/generic-repository.abstract';
import { Utils } from '@utils/utils.service';

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

  public create = (payload: any): Promise<T> => this._repository.save(payload);

  public deleteMany = (payload: Array<any>) => this._repository.remove(payload);

  public deleteOne = (condition: object) => this._repository.delete(condition);

  public findOne = (condition: object): Promise<T> => {
    const query = { ...condition, withDeleted: true };

    return this._repository.findOne(query);
  };

  public getAll = (payloadQueryParam: any = {}): Promise<T[]> => {
    const query = { ...payloadQueryParam, withDeleted: true };

    return this._repository.find(query);
  };

  public isExist = async (condition: object): Promise<boolean> => {
    const data = await this.findOne(condition);

    const isExist: boolean = this._utils.isNull(data) ? false : true;

    return isExist;
  };

  public restoreSoftDelete = (id: string | number) => this._repository.restore(id);

  public softDelete = (id: string | number) => this._repository.softDelete(id);

  public update = (id: any, payload: object) => this._repository.update({ id }, payload);

  public updateOrCreate = (payload: Array<object>, overwrite: Array<string>) => this._repository.upsert(payload, overwrite);
}
