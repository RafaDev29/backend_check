import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan } from 'typeorm';
import { TrackingEntity } from './entities/tracking.entity';
import { QueryTrackingDto } from './dto/query-tracking.dto';
import { RecordEntity, RecordStatus } from '../record/entities/record.entity';
import { CreateTrackingDto } from './dto/create-tracking.dto';

@Injectable()
export class TrackingService {
  constructor(
    @InjectRepository(TrackingEntity)
    private readonly trackingRepo: Repository<TrackingEntity>,

    @InjectRepository(RecordEntity)
    private readonly recordRepo: Repository<RecordEntity>,
  ) {}

  async create(dto: CreateTrackingDto) {
    const point = this.trackingRepo.create(dto);
    return await this.trackingRepo.save(point);
  }

async findByDate(query: QueryTrackingDto) {
  const { userId, date } = query;

  console.log('==============================');
  console.log('📅 TRACKING POR FECHA (UTC-5)');
  console.log('userId:', userId);
  console.log('date:', date);
  console.log('==============================');

  const records = await this.recordRepo.find({
    where: { userId },
    order: { createdAt: 'ASC' },
  });

  const recordsAdjusted = records.map(r => {
    const adjusted = new Date(r.createdAt);
    adjusted.setHours(adjusted.getHours() - 10);

    return {
      status: r.status,
      adjusted,
      logicalDate: adjusted.toISOString().slice(0, 10),
    };
  });

  const recordsOfDay = recordsAdjusted.filter(
    r => r.logicalDate === date,
  );

  const init = recordsOfDay.find(r => r.status === RecordStatus.INIT);
  const finish = [...recordsOfDay].reverse().find(
    r => r.status === RecordStatus.FINISH,
  );

  if (!init) {
    throw new BadRequestException(
      'No existe INIT para ese día (UTC-5)',
    );
  }

  const rangeStart = init.adjusted;

  let rangeEnd: Date;

  if (finish) {
    rangeEnd = finish.adjusted;
    console.log('🟥 FINISH encontrado');
  } else {
    rangeEnd = new Date(`${date}T23:59:59.999Z`);
    console.log('⚠️ SIN FINISH → usando fin del día');
  }

  console.log('⏱️ RANGO FINAL (UTC-5)');
  console.log('FROM:', rangeStart.toISOString());
  console.log('TO  :', rangeEnd.toISOString());
  console.log('==============================');

  const trackings = await this.trackingRepo.find({
    where: { userId },
    order: { createdAt: 'ASC' },
  });

  const trackingInRange = trackings
    .map(t => {
      const adjusted = new Date(t.createdAt);
      adjusted.setHours(adjusted.getHours() - 10);

      return {
        ...t,
        adjustedCreatedAt: adjusted,
      };
    })
    .filter(t =>
      t.adjustedCreatedAt >= rangeStart &&
      t.adjustedCreatedAt <= rangeEnd,
    );

  console.log('📍 TRACKINGS EN RANGO:', trackingInRange.length);
  trackingInRange.forEach(t => {
    console.log(
      '📍',
      'original:', t.createdAt.toISOString(),
      '| ajustado:', t.adjustedCreatedAt.toISOString(),
    );
  });
  console.log('==============================');

  return trackingInRange.map(t => ({
    id: t.id,
    userId: t.userId,
    latitude: t.latitude,
    longitude: t.longitude,
    createdAt: t.createdAt,
  }));
}



}
