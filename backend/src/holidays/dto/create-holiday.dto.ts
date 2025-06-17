import { IsString, MaxLength, IsOptional, IsDate } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateHolidayDto {
  @ApiProperty({ example: '2025-12-25', description: 'Date du jour férié' })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'La date du jour férié doit être une date valide.' })
  holidayDate: Date;

  @ApiPropertyOptional({ example: 'Noël', description: 'Nom du jour férié' })
  @IsOptional()
  @IsString({
    message: 'Le nom du jour férié doit être une chaîne de caractères.',
  })
  @MaxLength(125, {
    message: 'Le nom du jour férié ne doit pas dépasser 125 caractères.',
  })
  holidayName?: string;

  @ApiPropertyOptional({
    example: 'Une description',
    description: 'Description du jour férié',
  })
  @IsOptional()
  @IsString({
    message: 'La description du jour férié doit être une chaîne de caractères.',
  })
  @MaxLength(500, {
    message:
      'La description du jour férié ne doit pas dépasser 500 caractères.',
  })
  holidayDescription?: string;
}
