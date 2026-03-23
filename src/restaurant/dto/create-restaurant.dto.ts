import { IsValidOpeningHour, IsValidPhoneNumber } from "@core-decorators/custom-validator.decorator";
import { ApiProperty } from "@nestjs/swagger";
import { Utils } from "@utils/utils.service";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateRestaurantDto {
  @ApiProperty({
    description: 'Restaurant name',
    example: 'Restaurant Name',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Restaurant address',
    example: 'Gatot Subroto Street No. 123, Jakarta',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Restaurant phone must be start with 62',
    example: 'format msisdn : 628... / 08... / +628...',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsValidPhoneNumber()
  @Transform(({ value }) => new Utils().reformatMsisdn(value))
  phone: string;

  @ApiProperty({
    description: 'Restaurant opening hour',
    example: '09:00 - 22:00',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsValidOpeningHour()
  opening_hour: string;
}
