
import { PartialType } from '@nestjs/swagger';
import { CreateProviderServiceCategoryDto } from './create-provider-service-category.dto';

export class UpdateProviderServiceCategoryDto extends PartialType(CreateProviderServiceCategoryDto) { }