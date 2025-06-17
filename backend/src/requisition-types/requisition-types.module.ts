import { Module } from '@nestjs/common';
import { RequisitionTypesController } from './controllers/requisition-types.controller';
import { RequisitionTypesService } from './services/requisition-types.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { RequisitionType } from './entities/requisition-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RequisitionType]), AuthModule],
  controllers: [RequisitionTypesController],
  providers: [RequisitionTypesService],
  exports: [RequisitionTypesService],
})
export class RequisitionTypesModule {}
