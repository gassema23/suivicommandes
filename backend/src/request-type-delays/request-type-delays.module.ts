import { Module } from '@nestjs/common';
import { RequestTypeDelaysController } from './request-type-delays.controller';
import { RequestTypeDelaysService } from './request-type-delays.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestTypeServiceCategory } from '../request-type-service-categories/entities/request-type-service-category.entity';
import { DelayType } from '../delay-types/entities/delay-type.entity';
import { RequestTypeDelay } from './entities/request-type-delay.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RequestTypeServiceCategory,
      DelayType,
      RequestTypeDelay
    ]),
    AuthModule,
  ],
  controllers: [RequestTypeDelaysController],
  providers: [RequestTypeDelaysService],
  exports: [RequestTypeDelaysService],
})
export class RequestTypeDelaysModule {}
