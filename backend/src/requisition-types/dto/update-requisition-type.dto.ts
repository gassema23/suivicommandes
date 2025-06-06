
import { PartialType } from '@nestjs/swagger';
import { CreateRequisitionTypeDto } from './create-requisition-type.dto';

export class UpdateRequisitionTypeDto extends PartialType(CreateRequisitionTypeDto) { }