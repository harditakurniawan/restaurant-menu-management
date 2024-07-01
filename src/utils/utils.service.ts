import { Injectable } from '@nestjs/common';
import * as otpGenerator from 'otp-generator';
import { uuidv7 } from 'uuidv7';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { IFileManagement } from '@core-abstraction/file-management.abstract';
import { AppConfig } from '@core-config/config';
import * as fs from 'fs';
const crypto = require('crypto');

type FileUploadType = { 
  file: Express.Multer.File, 
  req : Request 
};

@Injectable()
export class Utils {
  private readonly _configService: ConfigService;

  constructor() {
    this._configService = new ConfigService();
  }

  public calculateTimeDifference(startDate: Date, endDate: Date): number {
    const startTime = moment(startDate);
    const endTime   = moment(endDate);
    const duration  = moment.duration(startTime.diff(endTime));

    return Math.floor(duration.asMinutes());
  };

  public capitalizedFirstLetterOfString(text: string): string {
    return text.replace(/\b\w/g, match => match.toUpperCase());
  }

  public currentTimeAsiaJakarta(): moment.Moment {
    return moment().utc().add(7, 'hours');
  }

  public convertToSlug(text: string): string {
    return text.toLocaleLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');
  }

  /**
   * Decrypt value from frontend
   * 
   * @param value 
   * @returns 
   */
  public decryptPayloadFE(value: string): any {
    const key = AppConfig.APP_NAME;
    const secretKey = crypto.createHash('sha256').update(key, 'utf-8').digest();

    const iv = Buffer.from(value.slice(0, 32), 'hex');
    const encryptedText = value.slice(32);
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');

    return JSON.parse(decrypted);
  }

  /**
   * Encrypt value to test inject poin
   * 
   * @param payload 
   * @returns 
   */
  public encryptPayload(payload: any): any {
    const key = AppConfig.APP_NAME;
    const secretKey = crypto.createHash('sha256').update(key, 'utf-8').digest();
    const paylaod = JSON.stringify(payload);

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
    let encrypted = cipher.update(paylaod, 'utf-8', 'hex');
    encrypted += cipher.final('hex');

    return iv.toString('hex') + encrypted;
  }

  public formatterPathEmbeddedDocument(object: { key: string; payload: object }, is_in_array: boolean): object {
    let newObject = {};
    Object.keys(object.payload).map(function eachKey(field) {
      newObject[`${object.key}${is_in_array ? '.$' : ''}.${field}`] =
        object.payload[field];
    });
    return newObject;
  };

  public generateOTP(lenghtNumber: number): string | number {
    return otpGenerator.generate(lenghtNumber, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
  };

  public generateRandomNumber(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public generateUUID(): string {
    return uuidv7();
  }

  public async hashing(text: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);

    return await bcrypt.hash(text, salt);
  };

  public isClientError(status: number): boolean {
    return status >= 400 && status < 500;
  }

  public isNull(value: any): boolean {
    if (value == undefined || value == null || value == '') {
      return true;
    }

    return false;
  };

  public isNumber(n: any) {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0);
  }

  public pushDataToArray(fieldName: string, payload: string | object | Array<object | string>): object {
    if (Array.isArray(payload)) {
      return { 
        $push: {
          [`${fieldName}`]: { $each: payload }
        }
      };
    }

    return {
      $push: {
        [`${fieldName}`]: payload
      }
    };
  };

  public async uploadFile(fileManagementAbstraction: IFileManagement, payload: FileUploadType): Promise<string> {
    const { file, req } = payload;

    return await fileManagementAbstraction.uploadFile(file, req);
  };

  public valdiateContainsNumber(text: string): boolean {
    return /\d/.test(text);
  };

  public valdiateContainsSpace(text: string): boolean {
    return /\s/g.test(text);
  };

  public validateContainsSpecialChars(text: string): boolean {
    const specialChars = /[`!@#$%^&*()+\-=_\[\]{};':"\\|,.<>\/?~]/;

    return specialChars.test(text);
  };

  public validateContainsSpecificText(wordToBeValidated: string, textToCheck: string): boolean {
    return textToCheck.includes(wordToBeValidated);
  };

  public validateEmailFormat(email: string): boolean {
    const validEmailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    return validEmailFormat.test(email);
  };

  public validatePhoneNumber(phone: string): boolean {
    const regex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;

    if (regex.exec(phone)) {
      return true;
    }

    return false;
  };

  public writeLogToFile(filename: string, content: string): void {
    const logsFolder = 'logs/';

    if (!fs.existsSync(logsFolder)) {
      fs.mkdirSync(logsFolder, { recursive: true });
    }

    fs.appendFile(`${logsFolder}/${filename}`, content, 'utf8', (err) => {
      if (err) throw err;
    });
  }
}