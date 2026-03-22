import { Command, Positional } from 'nestjs-command';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IDataService } from '@core-abstraction/data-service.abstract';
import { MenuItem } from '@database/entity/menu-item.entity';

@Injectable()
export class MenuItemSeeder {
constructor(
    private readonly repositoryService: IDataService,
) { }

@Command({ command: 'create:menu-item', describe: 'create menu item seeder' })
    async create() {
        try {
            const isMenuItemExist = await this.repositoryService.menuItems.count({});

            if (isMenuItemExist > 0) {
                console.log(`${MenuItemSeeder.name} already exist`);

                return;
            }

            const [categories, restaurants] = await Promise.all([
                this.repositoryService.categories.getAll({ order: { ord: "ASC" } }),
                this.repositoryService.restaurants.getAll(),
            ]);

            let valuesArray: string[] = [];

            restaurants.forEach((restaurant) => {
                categories.forEach((category, index) => {
                    const ord = index + 1;

                    valuesArray.push(`(
                        uuid_generate_v7(),
                        'Menu ${ord} - #${restaurant.name}',
                        'Description from restaurant ${restaurant.name} and menu ${ord}',
                        ${Math.floor(Math.random() * 100000) + 10000},
                        '${category.id}',
                        '${restaurant.id}'
                    )`);
                });
            });

            const values = valuesArray.join(',');

            await this.repositoryService.menuItems.rawQuery(`
                INSERT INTO menu_item (id, name, description, price, category_id, restaurant_id)
                VALUES
                    ${values}
            `);

            console.log(`${MenuItemSeeder.name} SUCCESS`);
        } catch (error) {
            console.log(`${MenuItemSeeder.name} ERROR`, error.message);

            throw new InternalServerErrorException(error.message);
        }
    }
}