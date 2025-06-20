import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDeliverableDelayFlowDto {
  @ApiProperty({
    example: 'd3f1e2c3-4567-890a-bcde-f1234567890a',
    description: 'ID du type de demande de délai pour le livrable',
  })
  @IsUUID('4', {
    message:
      "L'identifiant du type de demande de délai pour le livrable doit être un UUID valide.",
  })
  deliverableDelayRequestTypeId: string;

  @ApiProperty({
    example: 'a1b2c3d4-5678-90ab-cdef-1234567890ab',
    description: 'ID du flux',
  })
  @IsUUID('4', {
    message: "L'identifiant du flux doit être un UUID valide.",
  })
  flowId: string;
}
