
import { PartialType } from '@nestjs/swagger';
import { CreateSubdivisionClientDto } from './create-subdivision-client.dto';

export class UpdateSubdivisionClientDto extends PartialType(CreateSubdivisionClientDto) { }