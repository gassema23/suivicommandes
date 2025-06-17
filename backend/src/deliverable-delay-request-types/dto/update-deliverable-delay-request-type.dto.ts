import { PartialType } from '@nestjs/swagger';
import { CreateDeliverableDelayRequestTypeDto } from './create-deliverable-delay-request-type.dto';

export class UpdateDeliverableDelayRequestTypeDto extends PartialType(
  CreateDeliverableDelayRequestTypeDto,
) {}
