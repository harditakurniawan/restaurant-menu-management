import { Command } from 'nestjs-command';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IDataService } from '@core-abstraction/data-service.abstract';
import { Role } from '@core-enum/role.enum';
import { Utils } from '@utils/utils.service';
import { AppConfig } from '@core-config/config';

@Injectable()
export class AdminSeeder {
constructor(
    private readonly repositoryService  : IDataService,
    protected readonly utils            : Utils,
) { }

@Command({ command: 'create:admin', describe: 'create a admin' })
    async create() {
        try {
            const isAdminExist = await this.repositoryService.users.isExist({ email: AppConfig.APP_DEFAULT_ADMIN_EMAIL });

            if (isAdminExist) {
                console.log(`${AdminSeeder.name} ALREADY EXISTS`);
                return;
            }

            const adminRole = await this.repositoryService.roles.getAll({ where: { name: Role.ADMIN } });
            const admin = {
                name        : 'admin',
                email       : AppConfig.APP_DEFAULT_ADMIN_EMAIL,
                password    : await this.utils.hashing(AppConfig.APP_DEFAULT_ADMIN_PASSWORD),
                roles       : adminRole,
            };

            await this.repositoryService.users.save(admin);

            console.log(`${AdminSeeder.name} SUCCESS`);
        } catch (error) {
            console.log(`${AdminSeeder.name} ERROR`, error.message);

            throw new InternalServerErrorException(error.message);
        }
    }
}