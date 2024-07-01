import { AppConfig } from '@core-config/config';
import { v2 } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'Cloudinary',
  useFactory: () => {
    return v2.config({
      cloud_name: AppConfig.CLOUDINARY_CLOUD_NAME,
      api_key: AppConfig.CLOUDINARY_API_KEY,
      api_secret: AppConfig.CLOUDINARY_API_SECRET,
    })
    
  },
};