import { Module } from '@nestjs/common';
import { DeadlineService } from './services/deadline.service';
import { DeadlineController } from './controllers/deadline.controller';
import { HolidaysModule } from '@/holidays/holidays.module';
@Module({
  imports: [HolidaysModule],
  providers: [DeadlineService],
  controllers: [DeadlineController],
})
export class DeadlineModule {}
