import { IsString, MaxLength, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSubdivisionClientDto {
  @ApiPropertyOptional({ example: 'Une subdivision', description: 'Nom de la subdivision client' })
  @IsString()
  @IsOptional()
  @MaxLength(125)
  subdivisionClientName?: string;

  @ApiProperty({ example: '3000', description: 'Identifiant de la subdivision' })
  @IsString()
  @MaxLength(25)
  subdivisionClientNumber: string;

  @ApiPropertyOptional({ description: 'ID du client' })
  @IsUUID()
  clientId: string;
}