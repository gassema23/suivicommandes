import { Module } from '@nestjs/common';
import { RequestTypesController } from './controllers/request-types.controller';
import { RequestTypesService } from './services/request-types.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestType } from './entities/request-type.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([RequestType]), AuthModule],
  controllers: [RequestTypesController],
  providers: [RequestTypesService],
  exports: [RequestTypesService],
})
export class RequestTypesModule {}
