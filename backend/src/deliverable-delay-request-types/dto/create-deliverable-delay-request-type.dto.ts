import { IsString, MaxLength, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDeliverableDelayRequestTypeDto {
  @ApiProperty({
    example: 'd3f1e2c3-4567-890a-bcde-f1234567890a',
    description: 'ID de la catégorie de service du type de demande',
  })
  @IsUUID('4', {
    message:
      "L'ID de la catégorie de service du type de demande doit être un UUID valide.",
  })
  requestTypeServiceCategoryId: string;

  @ApiProperty({
    example: 'a1b2c3d4-5678-90ab-cdef-1234567890ab',
    description: 'ID du livrable',
  })
  @IsUUID('4', { message: "L'ID du livrable doit être un UUID valide." })
  deliverableId: string;
}
