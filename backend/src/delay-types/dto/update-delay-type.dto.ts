
import { PartialType } from '@nestjs/swagger';
import { CreateDelayTypeDto } from './create-delay-type.dto';

export class UpdateDelayTypeDto extends PartialType(CreateDelayTypeDto) { }