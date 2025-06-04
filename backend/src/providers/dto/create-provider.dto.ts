import {
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProviderDto {
  @ApiProperty({ example: 'TELUS', description: 'Nom du fournisseur' })
  @IsString()
  @MaxLength(125)
  providerName: string;

  @ApiPropertyOptional({ example: '8000', description: 'Code du fournisseur' })
  @IsString()
  @MaxLength(50)
  providerCode: string;
}
