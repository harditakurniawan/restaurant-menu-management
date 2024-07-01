import { diskStorage } from 'multer';
import { FastifyFileInterceptor } from './fastify-file.interceptor';
import { FastifyFilesInterceptor } from './fastify-files.interceptor';
import { FileFieldsFastifyInterceptor } from 'fastify-file-interceptor';
import { FileDriver } from '@core-enum/file-driver.enum';
import { allowedFileFilter, customFileName } from '@utils/file-util';
import { AppConfig, MAX_SIZE_FILE_UPLOAD } from '@core-config/config';

const driverType: string = AppConfig.APP_FILESYSTEM_DRIVER ?? FileDriver.LOCAL;

const localOption = {
  limits      : { fileSize: MAX_SIZE_FILE_UPLOAD },
  fileFilter  : allowedFileFilter,
  storage     : diskStorage({
    destination : `./upload`,
    filename    : customFileName,
  }),
};

const thirdPartyOption = {
  limits      : { fileSize: MAX_SIZE_FILE_UPLOAD },
  fileFilter  : allowedFileFilter,
};

const option = driverType === FileDriver.LOCAL ? localOption : thirdPartyOption;

/**
 * uplaod single file
 */
export const FileInterceptor = FastifyFileInterceptor('file', option);

/**
 * uplaod single file
 */
export const LocalFileInterceptor = FastifyFileInterceptor('file', localOption);

/**
 * uplaod multiple files
 */
export const FilesInterceptor = FastifyFilesInterceptor('files', 2, option);

/**
 * uplaod multiple files with custom field's name
 */
export const FilesFieldsFastifyInterceptor = FileFieldsFastifyInterceptor(
  [
    {
      name      : 'profile_picture',
      maxCount  : 1,
    },
    {
      name      : 'asset_physical',
      maxCount  : 1,
    },
  ],
  option,
);
