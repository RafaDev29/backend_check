// src/modules/records/record.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordEntity } from './entities/record.entity';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';


@Module({
  imports: [TypeOrmModule.forFeature([RecordEntity])],
  controllers: [RecordController],
  providers: [RecordService],
  exports: [RecordService],
})
export class RecordModule {}