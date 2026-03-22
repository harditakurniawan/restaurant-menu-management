import { Command, Positional } from 'nestjs-command';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IDataService } from '@core-abstraction/data-service.abstract';
import { Restaurant } from '@database/entity/restaurant.entity';
import { DummyRestaurantName } from '@core-enum/dummy-restaurant-name.enum';

@Injectable()
export class RestaurantSeeder {
constructor(
    private readonly repositoryService: IDataService,
) { }

@Command({ command: 'create:restaurant', describe: 'create restaurant seeder' })
    async create() {
        try {
            const isRestaurantExist = await this.repositoryService.restaurants.isExist({ name: DummyRestaurantName.RESTAURANT_1 });

            if (isRestaurantExist) {
                console.log(`${RestaurantSeeder.name} already exist`);

                return;
            }

            const restaurants = [
                {
                    name: DummyRestaurantName.RESTAURANT_1,
                    address: 'Jl. Sudirman No. 123',
                    phone: '628123456789',
                    opening_hour: '09:00 - 22:00',  
                },
                {
                    name: DummyRestaurantName.RESTAURANT_2,
                    address: 'Jl. Sudirman No. 456',
                    phone: '6281234567890',
                    opening_hour: '09:00 - 22:00',
                },
            ] as Restaurant[];

            await this.repositoryService.restaurants.insertMany(restaurants);

            console.log(`${RestaurantSeeder.name} SUCCESS`);
        } catch (error) {
            console.log(`${RestaurantSeeder.name} ERROR`, error.message);

            throw new InternalServerErrorException(error.message);
        }
    }
}