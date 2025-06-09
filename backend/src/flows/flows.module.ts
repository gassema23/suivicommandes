import { Module } from '@nestjs/common';
import { FlowsController } from './controllers/flows.controller';
import { FlowsService } from './services/flows.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flow } from './entities/flow.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Flow]), AuthModule],
  controllers: [FlowsController],
  providers: [FlowsService],
  exports: [FlowsService]
})
export class FlowsModule {}
