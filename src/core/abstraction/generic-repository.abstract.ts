export abstract class IGenericRepository<T> {
  abstract aggregation(pipeline, session?);
  abstract create(item: object, session?): Promise<T>;
  abstract createCollection();
  abstract createIndex(payload: any);
  abstract count(condition: object): Promise<number>;
  abstract deleteMany(condition: object);
  abstract deleteOne(condition: object);
  abstract dropIndex(indexWillBeDroped: string);
  abstract findOne(condition: object, optional?: object);
  abstract findOneById(id: string, select?: Array<string>);
  abstract findOneAndUpdate(condition: object, payload: object);
  abstract findOneByIdAndUpdate(id: string, payload: object);
  abstract findOneByIdAndDelete(id: string);
  abstract getAll(condition?: object, populate?: any): Promise<T[]>;
  abstract insertMany(payload: Array<object>, session?);
  abstract isExist(condition: object);
  abstract isIndexExist(indexName: string);
  abstract listCollections();
  abstract listIndexes();
  abstract updateMany(condition: object, payload: object);
  abstract updateOneOrCreate(condition: object, payload: object, option?: object);
}