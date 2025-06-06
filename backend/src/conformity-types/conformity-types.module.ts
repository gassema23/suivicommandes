import { Module } from '@nestjs/common';
import { ConformityTypesController } from './conformity-types.controller';
import { ConformityTypesService } from './conformity-types.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConformityType } from './entities/conformity-type.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ConformityType]), AuthModule],
  controllers: [ConformityTypesController],
  providers: [ConformityTypesService],
  exports: [ConformityTypesService]
})
export class ConformityTypesModule {}
