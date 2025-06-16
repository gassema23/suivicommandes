import { IsString, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiPropertyOptional({ example: 'MSSS', description: 'Nom du client' })
  @IsOptional()
  @IsString({ message: 'Le nom du client doit être une chaîne de caractères.' })
  @MaxLength(125, {
    message: 'Le nom du client ne doit pas dépasser 125 caractères.',
  })
  clientName?: string;

  @ApiProperty({ example: '6000', description: 'Identification du client' })
  @IsString({
    message: "L'identification du client doit être une chaîne de caractères.",
  })
  @MaxLength(25, {
    message: "L'identification du client ne doit pas dépasser 25 caractères.",
  })
  clientNumber: string;
}
