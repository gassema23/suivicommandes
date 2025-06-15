import { PartialType } from '@nestjs/swagger';
import { CreateConformityTypeDto } from './create-conformity-type.dto';

export class UpdateConformityTypeDto extends PartialType(
  CreateConformityTypeDto,
) {}
