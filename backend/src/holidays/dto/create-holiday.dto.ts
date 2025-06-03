import {
  IsString,
  MaxLength,
  IsOptional,
  IsUUID,
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateHolidayDto {
  @ApiProperty({ example: '2025-12-25', description: 'Date du jour férié' })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  holidayDate: Date;

  @ApiPropertyOptional({ example: 'Noël', description: 'Nom du jour férié' })
  @IsOptional()
  @IsString()
  @MaxLength(125)
  holidayName?: string;

  @ApiPropertyOptional({
    example: 'Une description',
    description: 'Description du jour férié',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  holidayDescription?: string;
}
