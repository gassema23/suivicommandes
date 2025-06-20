import { PartialType } from '@nestjs/swagger';
import { CreateDeliverableDelayFlowDto } from './create-deliverable-delay-flow.dto';

export class UpdateDeliverableDelayFlowDto extends PartialType(
  CreateDeliverableDelayFlowDto,
) {}
