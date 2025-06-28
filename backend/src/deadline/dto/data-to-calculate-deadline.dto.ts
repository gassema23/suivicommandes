import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, ValidateIf } from 'class-validator';

export class DataToCalculateDeadlineDto {
  @ApiProperty({
    description:
      'Identifiant de la catégorie de service pour laquelle le délai doit être calculé.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID(undefined, {
    message:
      "L'identifiant de la catégorie de service doit être un UUID valide.",
  })
  requestTypeServiceCategoryId: string;

  @ApiPropertyOptional({
    description:
      'Identifiant du type de demande pour lequel le délai doit être calculé.',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsOptional()
  @ValidateIf(
    (obj) =>
      obj.requestTypeDelayId !== undefined && obj.requestTypeDelayId !== '',
  )
  @IsUUID(undefined, {
    message: "L'identifiant du type de demande doit être un UUID valide.",
  })
  requestTypeDelayId?: string;
}
