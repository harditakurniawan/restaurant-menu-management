import { Request } from 'express';
import { extname } from 'path';
import * as moment from 'moment';
import { BadRequestException } from '@nestjs/common';
import { IFileMapper, IFilesMapper } from '@core-interface/interface';

export const customFileName = (req: Request, file: Express.Multer.File, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  callback(null, `${name}_${moment().format('YYYYMMDDHms')}${fileExtName}`);
};

export const allowedFileFilter = (req: Request, file: Express.Multer.File, callback) => {
  if (!file.originalname.match(/\.(jpg|webp|jpeg|png|svg|gif|mp4|mkv|csv|pdf)$/)) {
    return callback(new BadRequestException('format file are not allowed.'), false);
  }
  callback(null, true);
};

export const csvFileFilter = (req: Request, file: Express.Multer.File, callback) => {
  if (!file.originalname.match(/\.(csv)$/)) {
    return callback(new BadRequestException('Only image format are allowed.'), false);
  }
  callback(null, true);
};

export const pdfFileFilter = (req: Request, file: Express.Multer.File, callback) => {
  if (!file.originalname.match(/\.(pdf)$/)) {
    return callback(new BadRequestException('Only pdf format are allowed.'), false);
  }
  callback(null, true);
};

export const imageFileFilter = (req: Request, file: Express.Multer.File, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|svg)$/)) {
    return callback(new BadRequestException('Only image format are allowed.'), false);
  }
  callback(null, true);
};

export const gifFileFilter = (req: Request, file: Express.Multer.File, callback) => {
  if (!file.originalname.match(/\.(gif)$/)) {
    return callback(new BadRequestException('Only gif format are allowed.'), false);
  }
  callback(null, true);
};

export const videoFileFilter = (req: Request, file: Express.Multer.File, callback) => {
  if (!file.originalname.match(/\.(mp4|mkv)$/)) {
    return callback(new BadRequestException('Only mp4 and mkv files are allowed.'), false);
  }
  callback(null, true);
};

export const fileMapper = ({ file, req }: IFileMapper) => {
  const {
    filename      : fileName,
    path          : filePath,
    originalname  : originalName,
  } = file;

  const fileUrl = `${req.protocol}://${req.headers.host}/api/${filePath}`;

  return {
    originalName,
    fileName,
    filePath,
    fileUrl,
  };
};

export const filesMapper = ({ files, req }: IFilesMapper) => {
  return files.map((file) => {
    return fileMapper({ file, req });
  });
};
