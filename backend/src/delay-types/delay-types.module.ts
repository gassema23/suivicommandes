import { Module } from '@nestjs/common';
import { DelayTypesController } from './controllers/delay-types.controller';
import { DelayTypesService } from './services/delay-types.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DelayType } from './entities/delay-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DelayType]), AuthModule],
  controllers: [DelayTypesController],
  providers: [DelayTypesService],
  exports: [DelayTypesService]
})
export class DelayTypesModule {}
