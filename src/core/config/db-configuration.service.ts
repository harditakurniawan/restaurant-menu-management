
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ErrorMessageExpression } from '@core-enum/error-message-expression.enum';
import { AppConfig } from './config';
import { Utils } from '@utils/utils.service';

@Injectable()
export class DatabaseConfigurationService {
  private readonly _connectionString  : string;
  private readonly _databaseName      : string;
  private readonly _databaseUsername  : string;
  private readonly _databasePassword  : string;

  private _getConnectionStringFromEnvFile(): string {
    const connectionString = AppConfig.DB_URI;

    if (!connectionString) {
      throw new InternalServerErrorException(ErrorMessageExpression.DATABASE_HAS_NOT_BEEN_SET);
    }

    return connectionString;
  }

  constructor() {
    this._connectionString  = this._getConnectionStringFromEnvFile();
    this._databaseName      = AppConfig.DB_NAME;
    this._databaseUsername  = AppConfig.DB_USERNAME;
    this._databasePassword  = AppConfig.DB_PASSWORD;
  }

  get connectionString(): string {
    return this._connectionString;
  }

  get databaseName(): string {
    return this._databaseName;
  }

  get databaseUsername(): string {
    return this._databaseUsername;
  }

  get databasePassword(): string {
    return this._databasePassword;
  }
}
