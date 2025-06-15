import { IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProviderDto {
  @ApiProperty({ example: 'TELUS', description: 'Nom du fournisseur' })
  @IsString({
    message: 'Le nom du fournisseur doit être une chaîne de caractères.',
  })
  @MaxLength(125, {
    message: 'Le nom du fournisseur ne doit pas dépasser 125 caractères.',
  })
  providerName: string;

  @ApiPropertyOptional({ example: '8000', description: 'Code du fournisseur' })
  @IsString({
    message: 'Le code du fournisseur doit être une chaîne de caractères.',
  })
  @MaxLength(50, {
    message: 'Le code du fournisseur ne doit pas dépasser 50 caractères.',
  })
  providerCode: string;
}
