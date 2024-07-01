import { fileMapper } from "./file-util";
import { Request } from "express";
import { InternalServerErrorException } from "@nestjs/common";
import { IFileManagement } from "@core-abstraction/file-management.abstract";
import { CloudinaryService } from "@3rd-party/cloudinary/cloudinary.service";
import { AwsService } from "@3rd-party/aws/aws.service";

export class AwsManagementFile implements IFileManagement {
    constructor() {}

    uploadFile = async (file: Express.Multer.File): Promise<string> => {
        try {
            const awsService    = new AwsService();            
            const uploadedFile  = await awsService.uploadFileToS3(file);

            console.log(`${AwsManagementFile.name} - response : ${JSON.stringify(uploadedFile)}`);

            return uploadedFile.fileUrl;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }
}

export class CloudinaryManagementFile implements IFileManagement {
    uploadFile = async (file: Express.Multer.File): Promise<string> => {
        try {
            const cloudinaryService = new CloudinaryService();
            const uploadedFile      = await cloudinaryService.uploadImage(file);

            console.log(`${CloudinaryManagementFile.name} - response : ${JSON.stringify(uploadedFile)}`);

            return uploadedFile.secure_url;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }
}

export class LocalManagementFile implements IFileManagement {
    uploadFile = async (file: Express.Multer.File, req: Request): Promise<string> => {
        try {
            const uploadedFile = fileMapper({ file, req });

            console.log(`${LocalManagementFile.name} - response : ${JSON.stringify(uploadedFile)}`);

            return uploadedFile.fileUrl;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }
}