import { IsOptional, IsUUID, IsEnum, IsDateString } from 'class-validator';
import { RecordStatus } from '../entities/record.entity';

export class QueryRecordDto {
  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsEnum(RecordStatus)
  @IsOptional()
  status?: RecordStatus;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}