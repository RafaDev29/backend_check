
import { IsUUID, IsDateString } from 'class-validator';

export class QueryTrackingDto {
  @IsUUID()
  userId: string;

  @IsDateString()
  date: string; // "2025-12-16"
}
