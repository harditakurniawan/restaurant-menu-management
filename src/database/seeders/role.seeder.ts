import { Command, Positional } from 'nestjs-command';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IDataService } from '@core-abstraction/data-service.abstract';
import { Role } from '@core-enum/role.enum';

@Injectable()
export class RoleSeeder {
constructor(
    private readonly repositoryService: IDataService,
) { }

@Command({ command: 'create:role', describe: 'create a admin' })
async create() {
    try {
        const isRoleExist = await this.repositoryService.roles.count({});

        if (isRoleExist > 0) {
            console.log(`${RoleSeeder.name} already exist`);

            return;
        }

        const roles = [
            {
                name    : Role.ADMIN, 
            },
            {
                name    : Role.USER, 
            },
        ];

        await this.repositoryService.roles.insertMany(roles);

        console.log(`${RoleSeeder.name} SUCCESS`);
    } catch (error) {
        console.log(`${RoleSeeder.name} ERROR`, error.message);

        throw new InternalServerErrorException(error.message);
    }
}
}