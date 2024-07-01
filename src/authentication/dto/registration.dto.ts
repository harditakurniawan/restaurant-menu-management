import { IsUniqueEmail } from '@core-decorators/custom-validator.decorator';
import { Role } from '@database/entity/role.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegistrationDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @IsUniqueEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;

    roles: Role[];
}
