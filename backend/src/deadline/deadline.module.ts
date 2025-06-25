import { Module } from '@nestjs/common';
import { DeadlineService } from './services/deadline.service';
import { DeadlineController } from './controllers/deadline.controller';
import { HolidaysModule } from '@/holidays/holidays.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestTypeDelay } from '@/request-type-delays/entities/request-type-delay.entity';
import { RequestTypeServiceCategory } from '@/request-type-service-categories/entities/request-type-service-category.entity';
@Module({
  imports: [
    HolidaysModule,
    TypeOrmModule.forFeature([RequestTypeServiceCategory, RequestTypeDelay]),
  ],
  providers: [DeadlineService],
  controllers: [DeadlineController],
})
export class DeadlineModule {}
