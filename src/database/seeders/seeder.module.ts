import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { DataServicesModule } from '@database/data-service.module';
import { PermissionSeeder } from './permission.seeder';
import { RoleSeeder } from './role.seeder';
import { RolePermissionSeeder } from './role-permission.seeder';

@Module({
    imports: [
        CommandModule, 
        DataServicesModule,
    ],
    providers: [
        PermissionSeeder,
        RoleSeeder,
        RolePermissionSeeder,
    ],
})
export class SeederModule {}