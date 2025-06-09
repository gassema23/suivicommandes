import { IsString, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFlowDto {
  @ApiProperty({
    example: 'MCN -> Client',
    description: 'Nom du flux de transmission',
  })
  @IsOptional()
  @IsString({
    message:
      'Le nom du flux de transmission doit être une chaîne de caractères.',
  })
  @MaxLength(125, {
    message:
      'Le nom du flux de transmission ne doit pas dépasser 125 caractères.',
  })
  flowName?: string;

  @ApiPropertyOptional({
    example: 'Une description',
    description: 'Description du flux de transmission',
  })
  @IsOptional()
  @IsString({
    message:
      'La description du flux de transmission doit être une chaîne de caractères.',
  })
  @MaxLength(500, {
    message:
      'La description du flux de transmission ne doit pas dépasser 500 caractères.',
  })
  flowDescription?: string;
}
