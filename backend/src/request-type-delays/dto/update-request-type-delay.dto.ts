import { PartialType } from '@nestjs/swagger';
import { CreateRequestTypeDelayDto } from './create-request-type-delay.dto';

export class UpdateRequestTypeDelayDto extends PartialType(
  CreateRequestTypeDelayDto,
) {}
