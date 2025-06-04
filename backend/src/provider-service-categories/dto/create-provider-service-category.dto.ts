import { IsString, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProviderServiceCategoryDto {
  @ApiProperty({
    example: 'TELUS',
    description: 'ID du fournisseur',
  })
  @IsUUID()
  providerId: string;

  @ApiProperty({
    example: 'N/A',
    description: 'ID de la catégorie de service',
  })
  @IsUUID()
  serviceCategoryId: string;
}
