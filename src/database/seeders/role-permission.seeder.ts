import { Command, Positional } from 'nestjs-command';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IDataService } from '@core-abstraction/data-service.abstract';
import { Role } from '@core-enum/role.enum';

@Injectable()
export class RolePermissionSeeder {
constructor(
    private readonly repositoryService: IDataService,
) { }

@Command({ command: 'create:role-permission', describe: 'create a admin' })
async create() {
    try {
        const [roles, permissions] = await Promise.all([
            this.repositoryService.roles.getAll(),
            this.repositoryService.permissions.getAll(),
        ]);

        for (const role of roles) {
            role.permissions = permissions;

            await this.repositoryService.roles.save(role);
        }

        console.log(`${RolePermissionSeeder.name} SUCCESS`);
    } catch (error) {
        console.log(`${RolePermissionSeeder.name} ERROR`, error.message);

        throw new InternalServerErrorException(error.message);
    }
}
}