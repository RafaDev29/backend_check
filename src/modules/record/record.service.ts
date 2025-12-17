
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThan } from 'typeorm';
import { RecordEntity, RecordStatus } from './entities/record.entity';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { QueryRecordDto } from './dto/query-record.dto';


@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(RecordEntity)
    private readonly recordRepository: Repository<RecordEntity>,
  ) {}

 
private getTodayRange(): { startOfDay: Date; endOfDay: Date } {
  const nowUtc = new Date();

  // Offset Perú: UTC-5
  const offsetMs = 5 * 60 * 60 * 1000;

  // Convertimos "ahora" a hora Perú
  const peruNow = new Date(nowUtc.getTime() - offsetMs);

  // Inicio del día en hora Perú
  const startOfDayPeru = new Date(peruNow);
  startOfDayPeru.setHours(0, 0, 0, 0);


  const endOfDayPeru = new Date(peruNow);
  endOfDayPeru.setHours(23, 59, 59, 999);


  return {
    startOfDay: new Date(startOfDayPeru.getTime() + offsetMs),
    endOfDay: new Date(endOfDayPeru.getTime() + offsetMs),
  };
}



  private async hasRecordToday(userId: string, status: RecordStatus): Promise<boolean> {
    const { startOfDay, endOfDay } = this.getTodayRange();

    console.log('🔍 DEBUG hasRecordToday:');
    console.log('  userId:', userId);
    console.log('  status:', status);
    console.log('  startOfDay:', startOfDay.toISOString());
    console.log('  endOfDay:', endOfDay.toISOString());

    const records = await this.recordRepository.find({
      where: {
        userId,
        status,
        createdAt: Between(startOfDay, endOfDay),
      },
    });

    console.log('  registros encontrados:', records.length);
    if (records.length > 0) {
      console.log('  fechas de registros:');
      records.forEach((r, i) => {
        console.log(`    [${i}] ${r.createdAt.toISOString()} (${r.status})`);
      });
    }

    const count = records.length;
    console.log('  resultado final:', count > 0 ? 'YA EXISTE' : 'NO EXISTE');

    return count > 0;
  }

  async create(createRecordDto: CreateRecordDto): Promise<RecordEntity> {
    const { userId, status } = createRecordDto;

    const hasRecord = await this.hasRecordToday(userId, status);

    if (hasRecord) {
      const statusText = status === RecordStatus.INIT ? 'entrada (init)' : 'salida (finish)';
      throw new BadRequestException(
        `El usuario ya tiene un registro de ${statusText} el día de hoy`
      );
    }

    if (status === RecordStatus.FINISH) {
      const hasInit = await this.hasRecordToday(userId, RecordStatus.INIT);
      if (!hasInit) {
        throw new BadRequestException(
          'No se puede registrar una salida (finish) sin una entrada (init) previa el día de hoy'
        );
      }
    }

    const record = this.recordRepository.create(createRecordDto);
    return await this.recordRepository.save(record);
  }

  async findAll(query: QueryRecordDto): Promise<RecordEntity[]> {
    const { userId, status, startDate, endDate } = query;
    
    const queryBuilder = this.recordRepository
      .createQueryBuilder('record')
      .leftJoinAndSelect('record.user', 'user');

    if (userId) {
      queryBuilder.andWhere('record.userId = :userId', { userId });
    }

    if (status) {
      queryBuilder.andWhere('record.status = :status', { status });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere('record.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    return await queryBuilder
      .orderBy('record.createdAt', 'DESC')
      .getMany();
  }

  async findOne(id: string): Promise<RecordEntity> {
    const record = await this.recordRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!record) {
      throw new NotFoundException(`Record with ID ${id} not found`);
    }

    return record;
  }

  async findByUser(userId: string): Promise<RecordEntity[]> {
    return await this.recordRepository.find({
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateRecordDto: UpdateRecordDto): Promise<RecordEntity> {
    const record = await this.findOne(id);
    
    if (updateRecordDto.status && updateRecordDto.status !== record.status) {
      const hasRecord = await this.hasRecordToday(record.userId, updateRecordDto.status);
      if (hasRecord) {
        const statusText = updateRecordDto.status === RecordStatus.INIT ? 'entrada' : 'salida';
        throw new BadRequestException(
          `El usuario ya tiene un registro de ${statusText} el día de hoy`
        );
      }
    }
    
    Object.assign(record, updateRecordDto);
    
    return await this.recordRepository.save(record);
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    await this.recordRepository.remove(record);
  }

  async getUserRecordsToday(userId: string): Promise<RecordEntity[]> {
    const { startOfDay, endOfDay } = this.getTodayRange();

    return await this.recordRepository.find({
      where: {
        userId,
        createdAt: Between(startOfDay, endOfDay),
      },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
  }


  async getUserStatusToday(userId: string): Promise<{
    hasInit: boolean;
    hasFinish: boolean;
    canMarkInit: boolean;
    canMarkFinish: boolean;
  }> {
    const hasInit = await this.hasRecordToday(userId, RecordStatus.INIT);
    const hasFinish = await this.hasRecordToday(userId, RecordStatus.FINISH);

    return {
      hasInit,
      hasFinish,
      canMarkInit: !hasInit,
      canMarkFinish: hasInit && !hasFinish,
    };
  }
}