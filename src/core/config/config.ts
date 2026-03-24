import * as jwt from 'jsonwebtoken';
import { BaseResponseDto } from "@core-base-dto/base-response.dto";
import { Environment } from "@core-enum/environment.enum";
import { FileDriver } from "@core-enum/file-driver.enum";
import { HttpStatus } from "@nestjs/common";
import { ConfigService } from "@nestjs/config"
import { JwtModuleOptions } from "@nestjs/jwt";
import { AwsManagementFile, CloudinaryManagementFile, LocalManagementFile } from "@utils/file-management";

const configService = new ConfigService();

// const dbUri = process.env.DB_USERNAME !== '' && process.env.DB_PASSWORD !== ''
//   ? `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
//   : `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?replicaSet=rs0&directConnection=true`;

export const AppConfig = {
  APP_FILESYSTEM_DRIVER     : configService.get<string>('APP_FILESYSTEM_DRIVER') || FileDriver.LOCAL,
  APP_MODE                  : configService.get<string>('APP_MODE') || Environment.LOCAL,
  APP_NAME                  : configService.get<string>('APP_NAME'),
  APP_PORT                  : +configService.get<string>('APP_PORT'),
  APP_PREFIX                : configService.get<string>('APP_PREFIX'),
  APP_ROOT_FOLDER           : configService.get<string>('APP_ROOT_FOLDER'),
  APP_DEFAULT_ADMIN_EMAIL   : configService.get<string>('APP_DEFAULT_ADMIN_EMAIL'),
  APP_DEFAULT_ADMIN_PASSWORD: configService.get<string>('APP_DEFAULT_ADMIN_PASSWORD'),
  CLOUDINARY_API_KEY        : configService.get<string>('CLOUDINARY_API_KEY'),
  CLOUDINARY_API_SECRET     : configService.get<string>('CLOUDINARY_API_SECRET'),
  CLOUDINARY_CLOUD_NAME     : configService.get<string>('CLOUDINARY_CLOUD_NAME'),
  DB_CONNECTION             : configService.get<string>('DB_CONNECTION'),
  DB_HOST                   : configService.get<string>('DB_HOST') || 'localhost',
  DB_NAME                   : configService.get<string>('DB_NAME'),
  DB_PASSWORD               : configService.get<string>('DB_PASSWORD') || undefined,
  DB_PORT                   : +configService.get<string>('DB_PORT') || 27017,
  // DB_URI                : configService.get<string>('DB_URI') || dbUri,
  DB_USERNAME               : configService.get<string>('DB_USERNAME') || undefined,
  JWT_ALGORITHM             : configService.get<string>('JWT_ALGORITHM') as jwt.Algorithm,
  JWT_EXPIRED_TOKEN         : configService.get<string>('JWT_EXPIRED_TOKEN'),
  JWT_PRIVATE_KEY           : configService.get<string>('JWT_PRIVATE_KEY'),
  JWT_PUBLIC_KEY            : configService.get<string>('JWT_PUBLIC_KEY'),
  MAIL_HOST                 : configService.get<string>('MAIL_HOST'),
  MAIL_FROM_ADDRESS         : configService.get<string>('MAIL_FROM_ADDRESS'),
  MAIL_FROM_NAME            : configService.get<string>('MAIL_FROM_NAME'),
  MAIL_PASSWORD             : configService.get<string>('MAIL_PASSWORD'),
  MAIL_USERNAME             : configService.get<string>('MAIL_USERNAME'),
  S3_ID                     : configService.get<string>('S3_ID'),
  S3_BUCKET                 : configService.get<string>('S3_BUCKET'),
  S3_REGION                 : configService.get<string>('S3_REGION'),
  S3_SECRET                 : configService.get<string>('S3_SECRET'),
  S3_URL                    : configService.get<string>('S3_URL'),
};

export const httpMessage = {
    200: "OK",
    201: "Created",
    202: "Accepted",
    203: "Non-Authoritative Information",
    204: "No Content",
    400: "Bad Request",
    401: "Unauthorized",
    402: "Payment Required",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    406: "Not Acceptable",
    407: "Proxy Authentication Required",
    408: "Request Timeout",
    409: "Conflict",
    410: "Gone",
    411: "Length Required",
    412: "Precondition Failed",
    413: "Content Too Large",
    414: "URI Too Long",
    415: "Unsupported Media Type",
    416: "Range Not Satisfiable",
    417: "Expectation Failed",
    421: "Misdirected Request",
    422: "Unprocessable Content",
    423: "Locked",
    424: "Failed Dependency",
    425: "Too Early",
    426: "Upgrade Required",
    428: "Precondition Required",
    429: "Too Many Requests",
    431: "Request Header Fields Too Large",
    451: "Unavailable for Legal Reasons",
    500: "Internal Server Error",
    501: "Not Implemented",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
    505: "HTTP Version Not Supported",
    506: "Variant Also Negotiates",
    507: "Insufficient Storage",
    508: "Loop Detected",
    511: "Network Authentication Required",
}

export const jwtConfig: JwtModuleOptions = {
  privateKey  : AppConfig.JWT_PRIVATE_KEY,
  publicKey   : AppConfig.JWT_PUBLIC_KEY,
  signOptions : {
    expiresIn   : AppConfig.JWT_EXPIRED_TOKEN,
    issuer      : 'AuthenticationService',
    algorithm   : AppConfig.JWT_ALGORITHM,
  },
}

export const ApiResponseExample = {
  DEFAULT: {
    type        : BaseResponseDto,
    description : `Default body response form for all responses`,
  },
  OK: {
    status      : HttpStatus.OK,
    type        : BaseResponseDto,
    description : `Success`,
  },
  INTERNAL_ERROR: {
    status      : HttpStatus.INTERNAL_SERVER_ERROR,
    type        : BaseResponseDto,
    description : `Internal Server Error`,
  },
  UNAUTHORIZED: {
    status      : HttpStatus.UNAUTHORIZED,
    type        : BaseResponseDto,
    description : `Unauthorize`,
  },
};

export const CLOUDINARY = 'Cloudinary';

export const MAX_SIZE_FILE_UPLOAD: number = 5000000; // 5MB

export const PrefixLogFileName = {
  default      : 'app',
  success      : 'app_success',
  error_client : 'error_client',
  error_server : 'error_server',
}

export const FileManagementClass = {
  [FileDriver.AWS]        : new AwsManagementFile(),
  [FileDriver.CLOUDINARY] : new CloudinaryManagementFile(),
  [FileDriver.LOCAL]      : new LocalManagementFile(),
}

export const PostgresErrorCode = {
  UNIQUE_VIOLATION: '23505',
  FOREIGN_KEY_VIOLATION: '23503',
  NOT_NULL_VIOLATION: '23502',
  CHECK_VIOLATION: '23514',
  INVALID_TEXT_REPRESENTATION: '22P02',
  UNDEFINED_COLUMN: '42703',
  UNDEFINED_TABLE: '42P01',
  STRING_DATA_RIGHT_TRUNCATION: '22001',
};