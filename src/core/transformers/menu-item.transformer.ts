import { BaseTransformer } from "./base.transformer";
import { MenuItem } from "@database/entity/menu-item.entity";
import { CategoryTransformer } from "./category.transformer";

export class MenuItemTransformer extends BaseTransformer {

    /**
     * Response menu item
     * 
     * @param data 
     * @returns 
     */
    static singleTransform (data: MenuItem) {
        let response =  { 
            id              : data.id,
            name            : data.name,
            description     : data.description,
            price           : data.price,
            is_available    : data.isAvailable,
            created_at      : data.createdAt,
            updated_at      : data.updatedAt,
            category        : data.category ? CategoryTransformer.singleTransform(data.category) : null
        };

        return response;
    }
}