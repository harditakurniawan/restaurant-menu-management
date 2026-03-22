import { Command } from 'nestjs-command';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IDataService } from '@core-abstraction/data-service.abstract';

@Injectable()
export class RolePermissionSeeder {
constructor(
    private readonly repositoryService: IDataService,
) { }

@Command({ command: 'create:role-permission', describe: 'create role permission seeder' })
    async create() {
        try {
            const [roles, permissions] = await Promise.all([
                this.repositoryService.roles.getAll({ relations: ['permissions'] }),
                this.repositoryService.permissions.getAll(),
            ]);

            for (const role of roles) {
                if (role.permissions && role.permissions.length > 0) {
                    continue;
                }

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