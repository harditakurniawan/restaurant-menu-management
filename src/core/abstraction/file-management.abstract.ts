import { Request } from "express";

export abstract class IFileManagement{
    abstract uploadFile (file: Express.Multer.File, req?: Request): Promise<string>;
}