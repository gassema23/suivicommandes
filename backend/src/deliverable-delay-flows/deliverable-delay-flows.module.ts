import { Module } from '@nestjs/common';
import { DeliverableDelayFlowsController } from './controllers/deliverable-delay-flows.controller';
import { DeliverableDelayFlowsService } from './services/deliverable-delay-flows.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliverableDelayRequestType } from '../deliverable-delay-request-types/entities/deliverable-delay-request-type.entity';
import { Flow } from '../flows/entities/flow.entity';
import { DeliverableDelayFlow } from './entities/deliverable-delay-flow.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DeliverableDelayRequestType,
      Flow,
      DeliverableDelayFlow,
    ]),
    AuthModule,
  ],
  controllers: [DeliverableDelayFlowsController],
  providers: [DeliverableDelayFlowsService],
  exports: [DeliverableDelayFlowsService],
})
export class DeliverableDelayFlowsModule {}
