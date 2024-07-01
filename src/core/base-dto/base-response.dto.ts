import { Type } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IResponse } from '@core-interface/interface';

class Meta {
  @ApiProperty()
  @Type(() => Number)
  status_code: number;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsArray()
  @IsString()
  message: string[];

  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty()
  @Type(() => Number)
  last_page: number;

  @ApiProperty()
  @Type(() => Number)
  per_page: number;

  @ApiProperty()
  @Type(() => Number)
  page: number;

  @ApiProperty()
  @Type(() => Number)
  total: number;
}

export class BaseResponseDto implements IResponse<any> {
  @ApiProperty({
    type: Meta,
  })
  @Type(() => Meta)
  meta: Meta;

  @ApiProperty()
  data: any;
}
