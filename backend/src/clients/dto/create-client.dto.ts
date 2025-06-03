import { IsString, MaxLength, IsOptional, IsDate } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiPropertyOptional({ example: 'MSSS', description: 'Nom du client' })
  @IsOptional()
  @IsString()
  @MaxLength(125)
  clientName?: string;

  @ApiProperty({ example: '6000', description: 'Identification du client' })
  @IsString()
  @MaxLength(25)
  clientNumber: string;
}
