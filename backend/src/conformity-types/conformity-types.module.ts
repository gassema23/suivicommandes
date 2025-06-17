import { Module } from '@nestjs/common';
import { ConformityTypesService } from './services/conformity-types.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConformityType } from './entities/conformity-type.entity';
import { AuthModule } from '../auth/auth.module';
import { ConformityTypesController } from './controllers/conformity-types.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ConformityType]), AuthModule],
  controllers: [ConformityTypesController],
  providers: [ConformityTypesService],
  exports: [ConformityTypesService],
})
export class ConformityTypesModule {}
