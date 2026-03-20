import { Command, Positional } from 'nestjs-command';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IDataService } from '@core-abstraction/data-service.abstract';
import { Role } from '@core-enum/role.enum';

@Injectable()
export class PermissionSeeder {
constructor(
    private readonly repositoryService: IDataService,
) { }

@Command({ command: 'create:permission', describe: 'create a admin' })
async create() {
    try {
        const isPermissionExist = await this.repositoryService.permissions.count({});

        if (isPermissionExist > 0) {
            console.log(`${PermissionSeeder.name} already exist`);

            return;
        }

        const permissions = [
            {
                groupName   : 'Management Profile',
                name        : 'profile_access', 
            },
            {
                groupName   : 'Management Profile',
                name        : 'profile_create', 
            },
            {
                groupName   : 'Management Profile',
                name        : 'profile_edit', 
            },
            {
                groupName   : 'Management Profile',
                name        : 'profile_show', 
            },
            {
                groupName   : 'Management Profile',
                name        : 'profile_delete', 
            },
        ];

        await this.repositoryService.permissions.insertMany(permissions);

        console.log(`${PermissionSeeder.name} SUCCESS`);
    } catch (error) {
        console.log(`${PermissionSeeder.name} ERROR`, error.message);

        throw new InternalServerErrorException(error.message);
    }
}
}