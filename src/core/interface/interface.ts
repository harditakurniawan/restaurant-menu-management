
import { Request } from 'express';

export interface IAuth {
  id          : string,
  email       : string,
  roles?      : Array<string>,
  permission? : Array<string>,
}

export interface IFileMapper {
  file  : Express.Multer.File;
  req   : Request;
}

export interface IFilesMapper {
  files : Express.Multer.File[];
  req   : Request;
}

export interface ILogContent {
  request_id       : string,
  request_time     : string,
  request_ip       : string,
  host_name        : string,
  user_agent       : string | Array<string>,
  request_method   : string,
  request_url      : string,
  request_body     : any | object | null,
  response_time    : number | null,
  response_code    : number,
  response_message : string | Array<string> | null,
  response_body    : string | object | null,
  stack            : any | null,
}

export interface IMessage {
  message       : string;
  [key: string] : any;
}

export interface IResponse<T> {
  meta: {
    status_code : number;
    status      : string;
    message     : string[];
    url         : string;
    last_page   : number;
    per_page    : number;
    page        : number;
    total       : number;
  };
  data: T;
}

interface Condition {
  [key: string]: any;
}

interface Pagination {
  order : { [key: string]: string }; // example = orders: { id: 'DESC' }
  take  : number;
  skip  : number;
}

export interface IFilter {
  condition : Condition;
  pagination: Pagination;
}