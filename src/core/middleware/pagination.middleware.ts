import { Injectable, NestMiddleware } from '@nestjs/common';
import * as moment from 'moment';
import { ILike, IsNull, MoreThanOrEqual, Not } from 'typeorm';
import { IFilter } from '../interface/interface';
import { DEFAULT_ORDER_BY, DEFAULT_SORT_TYPE } from '@core-base-dto/base-filter.dto';

@Injectable()
export class PaginationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const requestQuery = req['query'];
    const paginateParamsWhitelist = ['perPage', 'page', 'orderBy', 'sortType'];
    const { perPage, page, orderBy, sortType, sortBy, createdAt, ...queryParam } = requestQuery;

    const perPages = parseInt(perPage && perPage > 0 ? perPage : 15);
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

    Object.keys(queryParam).map((key) => {
      if (!paginateParamsWhitelist.includes(key)) {
        let newCondition = { [key]: requestQuery[key] };

        if (['createdAt'].includes(key)) {
          const createdat = moment(createdAt).format('YYYY-MM-DD HH:mm:ss:SSS');
          newCondition = { [key]: MoreThanOrEqual(createdat) };
        }

        if (key !== 'id') {
          newCondition = { [key]: ILike(`%${requestQuery[key]}%`) };
        }

        if (key == 'isActive') {
          newCondition = {
            deletedAt: requestQuery[key] == true ? IsNull() : Not(IsNull()),
          };
        }

        filter.condition = { ...filter.condition, ...newCondition };
      } else {
        filter.pagination = {
          order: { [order]: sort },
          take: perPage,
          skip,
        };
      }
    });
    
    req['query']['filter'] = filter;
    req['query']['perPage'] = perPages;
    req['query']['page'] = pages;

    next();
  }
}