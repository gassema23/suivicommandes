import { Module } from '@nestjs/common';
import { DeliverableDelayRequestTypesController } from './controllers/deliverable-delay-request-types.controller';
import { DeliverableDelayRequestTypesService } from './services/deliverable-delay-request-types.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliverableDelayRequestType } from './entities/deliverable-delay-request-type.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([DeliverableDelayRequestType]), AuthModule],
  controllers: [DeliverableDelayRequestTypesController],
  providers: [DeliverableDelayRequestTypesService],
})
export class DeliverableDelayRequestTypesModule {}
