import { BaseTransformer } from "./base.transformer";
import { Category } from "@database/entity/category.entity";

export class CategoryTransformer extends BaseTransformer {

    /**
     * Response category
     * 
     * @param data 
     * @returns 
     */
    static singleTransform (data: Category) {
        let response =  { 
            id              : data.id,
            name            : data.name,
            code            : data.code,
            ord             : data.ord,
            created_at      : data.createdAt,
            updated_at      : data.updatedAt,
        };

        return response;
    }
}