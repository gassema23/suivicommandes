import { Module } from '@nestjs/common';
import { SectorsController } from './sectors.controller';
import { SectorsService } from './sectors.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Sector } from './entities/sectors.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sector]), AuthModule],
  controllers: [SectorsController],
  providers: [SectorsService],
  exports: [SectorsService],
})
export class SectorsModule {}
