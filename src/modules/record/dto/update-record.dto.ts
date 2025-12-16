import {  IsNumber, IsString, Min, Max, IsOptional, IsEnum } from 'class-validator';
import { RecordStatus } from '../entities/record.entity';


export class UpdateRecordDto {
  @IsNumber()
  @Min(-90)
  @Max(90)
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  @IsOptional()
  longitude?: number;

  @IsEnum(RecordStatus)
  @IsOptional()
  status?: RecordStatus;

  @IsString()
  @IsOptional()
  notes?: string;
}
