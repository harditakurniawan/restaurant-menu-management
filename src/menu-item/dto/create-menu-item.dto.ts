import { Category } from "@database/entity/category.entity";
import { Restaurant } from "@database/entity/restaurant.entity";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";

export class CreateMenuItemDto {
    @ApiProperty({
        description: 'Menu Item name',
        example: 'Menu Item Name',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Menu Item description',
        example: 'Menu Item Description',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        description: 'Menu Item price',
        example: 10000,
        required: true,
    })
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    price: number;

    @ApiProperty({
        description: 'Menu Item availability',
        example: true,
        required: true,
    })
    @IsBoolean()
    @IsNotEmpty()
    is_available: boolean;

    @ApiProperty({
        description: 'Menu Item category id',
        example: 'xxxx-xxxx-xxxx-xxxx',
        required: true,
    })
    @IsNotEmpty()
    @IsUUID()
    category_id: string;
}
