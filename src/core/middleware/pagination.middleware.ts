import { Injectable, NestMiddleware } from '@nestjs/common';
import * as moment from 'moment';
import { ILike, IsNull, MoreThanOrEqual, Not } from 'typeorm';
import { IFilter } from '../interface/interface';
import { DEFAULT_LIMIT, DEFAULT_ORDER_BY, DEFAULT_SORT_TYPE } from '@core-base-dto/base-filter.dto';

@Injectable()
export class PaginationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const requestQuery = req['query'];
    const paginateParamsWhitelist = ['perPage', 'page', 'orderBy', 'sortType'];
    const { perPage, page, orderBy, sortType, sortBy, createdAt, ...queryParam } = requestQuery;

    const perPages = parseInt(perPage && perPage > 0 ? perPage : DEFAULT_LIMIT);
    const pages = parseInt(page && page > 0 ? page : 1);

    const order = orderBy || DEFAULT_ORDER_BY;
    const sort = sortType?.toUpperCase() || DEFAULT_SORT_TYPE;
    const skip = perPages * pages - perPages;

    const filter: IFilter = {
      condition: {},
      pagination: {
        order: { [order]: sort },
        take: perPages,
        skip,
      },
    };

    Object.keys(queryParam).forEach((key) => {
      if (paginateParamsWhitelist.includes(key)) return;

      const value = requestQuery[key];
      let condition = {};

      if (key === 'createdAt') {
        const formattedDate = moment(value).format('YYYY-MM-DD HH:mm:ss:SSS');
        condition = { [key]: MoreThanOrEqual(formattedDate) };
      } 
      else if (key === 'isActive') {
        condition = { deletedAt: value === 'true' ? IsNull() : Not(IsNull()) };
      } 
      else if (key.endsWith('_id')) {
        const relationName = key.replace('_id', '');
        condition = { [relationName]: { id: value } };
      } 
      else if (key === 'id') {
        condition = { id: value };
      } 
      else {
        condition = { [key]: ILike(`%${value}%`) };
      }

      filter.condition = { ...filter.condition, ...condition };
    });
    
    req['query']['filter'] = filter;
    req['query']['perPage'] = perPages;
    req['query']['page'] = pages;

    next();
  }
}