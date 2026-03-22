import { Command, Positional } from 'nestjs-command';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IDataService } from '@core-abstraction/data-service.abstract';
import { Category as CategoryEnum } from '@core-enum/category.enum';
import { Category } from '@database/entity/category.entity';

@Injectable()
export class CategorySeeder {
constructor(
    private readonly repositoryService: IDataService,
) { }

@Command({ command: 'create:category', describe: 'create category seeder' })
    async create() {
        try {
            const isCategoryExist = await this.repositoryService.categories.isExist({ code: CategoryEnum.APPETIZER });

            if (isCategoryExist) {
                console.log(`${CategorySeeder.name} already exist`);

                return;
            }

            const categories = [
                {
                    name: 'Appetizer',
                    code: CategoryEnum.APPETIZER,
                    ord: 1
                },
                {
                    name: 'Main Course',
                    code: CategoryEnum.MAIN_COURSE,
                    ord: 2
                },
                {
                    name: 'Dessert',
                    code: CategoryEnum.DESSERT,
                    ord: 3
                },
                {
                    name: 'Drink',
                    code: CategoryEnum.DRINK,
                    ord: 4
                },
                {
                    name: 'Soup',
                    code: CategoryEnum.SOUP,
                    ord: 5
                },
            ] as Category[];

            await this.repositoryService.categories.insertMany(categories);

            console.log(`${CategorySeeder.name} SUCCESS`);
        } catch (error) {
            console.log(`${CategorySeeder.name} ERROR`, error.message);

            throw new InternalServerErrorException(error.message);
        }
    }
}