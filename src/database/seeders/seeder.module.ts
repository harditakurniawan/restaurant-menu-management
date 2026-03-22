import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { DataServicesModule } from '@database/data-service.module';
import { PermissionSeeder } from './permission.seeder';
import { RoleSeeder } from './role.seeder';
import { RolePermissionSeeder } from './role-permission.seeder';
import { AdminSeeder } from './admin.seeder';
import { Utils } from '@utils/utils.service';
import { CategorySeeder } from './category.seeder';
import { RestaurantSeeder } from './restaurant.seeder';
import { MenuItemSeeder } from './menu-item.seeder';

@Module({
    imports: [
        CommandModule, 
        DataServicesModule,
    ],

    // seeders must be in order
    providers: [
        PermissionSeeder,
        RoleSeeder,
        RolePermissionSeeder,
        AdminSeeder,
        CategorySeeder,
        RestaurantSeeder,
        MenuItemSeeder,
        Utils, // Utils should be the last provider to be initialized
    ],
})
export class SeederModule {}