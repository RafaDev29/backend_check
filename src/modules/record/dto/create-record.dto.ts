// src/modules/records/dto/create-record.dto.ts
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { RecordStatus } from '../entities/record.entity';

export class CreateRecordDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @IsEnum(RecordStatus)
  @IsNotEmpty()
  status: RecordStatus;

  @IsString()
  @IsOptional()
  notes?: string;
}
