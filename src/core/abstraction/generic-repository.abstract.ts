export abstract class IGenericRepository<T> {
  abstract count(payload: object): Promise<number>;
  abstract create(payload: object): Promise<T>;
  abstract deleteMany(payload: Array<any>);
  abstract deleteOne(condition: object);
  abstract findOne(condition: object): Promise<T>;
  abstract getAll(condition?: object): Promise<T[]>;
  abstract isExist(condition?: object): Promise<boolean>;
  abstract restoreSoftDelete(id: string | number): any;
  abstract softDelete(id: string | number): any;
  abstract update(id: string | number, payload: object);
  abstract updateOrCreate(payload: Array<object>, overwrite: Array<string>);
}