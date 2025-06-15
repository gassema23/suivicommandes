import { Module } from '@nestjs/common';
import { HolidaysController } from './controllers/holidays.controller';
import { HolidaysService } from './services/holidays.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Holiday } from './entities/holiday.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Holiday]), AuthModule],
  controllers: [HolidaysController],
  providers: [HolidaysService],
  exports: [HolidaysService],
})
export class HolidaysModule {}
