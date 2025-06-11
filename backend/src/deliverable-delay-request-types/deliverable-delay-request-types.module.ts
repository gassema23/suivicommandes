import { Module } from '@nestjs/common';
import { DeliverableDelayRequestTypesController } from './controllers/deliverable-delay-request-types.controller';
import { DeliverableDelayRequestTypesService } from './services/deliverable-delay-request-types.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliverableDelayRequestType } from './entities/deliverable-delay-request-type.entity';
import { AuthModule } from '../auth/auth.module';
import { Deliverable } from '../deliverables/entities/deliverable.entity';
import { RequestTypeServiceCategory } from '../request-type-service-categories/entities/request-type-service-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DeliverableDelayRequestType,
      RequestTypeServiceCategory,
      Deliverable,
    ]),
    AuthModule,
  ],
  controllers: [DeliverableDelayRequestTypesController],
  providers: [DeliverableDelayRequestTypesService],
  exports: [DeliverableDelayRequestTypesService],
})
export class DeliverableDelayRequestTypesModule {}
