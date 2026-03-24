import { ApiProperty } from '@nestjs/swagger';
import { CreateMenuItemDto } from './create-menu-item.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateMenuItemDto extends CreateMenuItemDto {
    @ApiProperty({
        description: 'Menu Item restaurant id',
        example: 'xxxx-xxxx-xxxx-xxxx',
        required: true,
    })
    @IsNotEmpty()
    @IsUUID()
    restaurant_id: string;
}
