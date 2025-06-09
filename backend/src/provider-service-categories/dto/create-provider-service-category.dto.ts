import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProviderServiceCategoryDto {
  @ApiProperty({
    example: 'TELUS',
    description: 'ID du fournisseur',
  })
  @IsUUID('4', {
    message:
      "Le champ 'providerId' doit être un UUID v4 valide pour le fournisseur.",
  })
  providerId: string;

  @ApiProperty({
    example: 'N/A',
    description: 'ID de la catégorie de service',
  })
  @IsUUID('4', {
    message:
      "Le champ 'serviceCategoryId' doit être un UUID v4 valide pour la catégorie de service.",
  })
  serviceCategoryId: string;
}
