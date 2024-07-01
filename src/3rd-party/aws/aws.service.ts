import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import * as moment from 'moment';
import { AppConfig } from '@core-config/config';

@Injectable()
export class AwsService {
  private _config: typeof AppConfig;
  private _s3: S3Client;
  private _s3_url: string;
  private _s3_access_key_id: string;
  private _s3_access_key_secret: string;
  private _s3_region: string;
  private _s3_bucket_name: string;

  constructor() {
    this._s3_access_key_id      = this._config.S3_ID;
    this._s3_access_key_secret  = this._config.S3_SECRET;
    this._s3_region             = this._config.S3_REGION;
    this._s3_bucket_name        = this._config.S3_BUCKET;
    this._s3_url                = this._config.S3_URL;

    this._s3 = new S3Client({
      region: this._s3_region,
      credentials:{
        accessKeyId: this._s3_access_key_id,
        secretAccessKey: this._s3_access_key_secret,
      }
    });
  }

  /**
   * This method is to send a file to aws s3 - cloud storage.
   * 
   * @param file 
   * @returns 
   */
  public uploadFileToS3 = async (file: Express.Multer.File): Promise<any> => {
    const { originalname, mimetype, buffer } = file;
    const prefix = moment().format('DDMMYYYYHHmmssSSS');

    try {
      const params: any = {
        Bucket: this._s3_bucket_name,
        Key: `a-space/${prefix}_${originalname.split(' ').join('')}`,
        Body: buffer,
        ACL: 'public-read',
        ContentType: mimetype,
        ContentDisposition: 'inline',
        CreateBucketConfiguration: {
          LocationConstraint: 'ap-south-1',
        },
      };

      const uploadedFile = await this._s3.send(new PutObjectCommand(params));

      const fileUrl = `${this._s3_url}${params.Key}`;

      return { ...uploadedFile, fileUrl };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  };
}
