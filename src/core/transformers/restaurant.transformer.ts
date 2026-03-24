import { BaseTransformer } from "./base.transformer";
import { Restaurant } from "@database/entity/restaurant.entity";
import { MenuItemTransformer } from "./menu-item.transformer";

export class RestaurantTransformer extends BaseTransformer {

    /**
     * Response restaurant
     * 
     * @param data 
     * @returns 
     */
    static singleTransform (data: Restaurant) {
        let response =  { 
            id              : data.id,
            name            : data.name,
            address         : data.address,
            phone           : data.phone,
            opening_hour    : data.opening_hour,
            created_at      : data.createdAt,
            updated_at      : data.updatedAt,
            menu_items      : data.menuItems ? MenuItemTransformer.transform(data.menuItems) : null,
        };

        return response;
    }
}