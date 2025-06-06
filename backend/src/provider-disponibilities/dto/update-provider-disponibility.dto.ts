import { PartialType } from '@nestjs/swagger';
import { CreateProviderDisponibilityDto } from './create-provider-disponibility.dto';

export class UpdateProviderDisponibilityDto extends PartialType(CreateProviderDisponibilityDto) {}
