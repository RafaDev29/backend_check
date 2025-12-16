import { Module } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { TrackingController } from './tracking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackingEntity } from './entities/tracking.entity';
import { RecordEntity } from '../record/entities/record.entity';

@Module({
  imports :[TypeOrmModule.forFeature([TrackingEntity , RecordEntity])],
  controllers: [TrackingController],
  providers: [TrackingService],
})
export class TrackingModule {}
