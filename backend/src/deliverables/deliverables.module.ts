import { Module } from '@nestjs/common';
import { DeliverablesController } from './controllers/deliverables.controller';
import { DeliverablesService } from './services/deliverables.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deliverable } from './entities/deliverable.entity';
import { AuthModule } from '../auth/auth.module';

@Module({

    imports: [TypeOrmModule.forFeature([Deliverable]), AuthModule],
  controllers: [DeliverablesController],
  providers: [DeliverablesService],
  exports: [DeliverablesService]
})
export class DeliverablesModule {}
