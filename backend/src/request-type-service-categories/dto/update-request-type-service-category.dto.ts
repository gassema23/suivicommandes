
import { PartialType } from '@nestjs/swagger';
import { CreateRequestTypeServiceCategoryDto } from './create-request-type-service-category.dto';

export class UpdateRequestTypeServiceCategoryDto extends PartialType(CreateRequestTypeServiceCategoryDto) { }