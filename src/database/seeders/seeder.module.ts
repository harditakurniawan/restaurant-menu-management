import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { DataServicesModule } from '@database/data-service.module';
import { PermissionSeeder } from './permission.seeder';
import { RoleSeeder } from './role.seeder';
import { RolePermissionSeeder } from './role-permission.seeder';
import { AdminSeeder } from './admin.seeder';
import { Utils } from '@utils/utils.service';

@Module({
    imports: [
        CommandModule, 
        DataServicesModule,
    ],
    providers: [
        PermissionSeeder,
        RoleSeeder,
        RolePermissionSeeder,
        AdminSeeder,
        Utils, // Utils should be the last provider to be initialized
    ],
})
export class SeederModule {}