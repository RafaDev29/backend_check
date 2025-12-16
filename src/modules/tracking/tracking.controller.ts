
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { CreateTrackingDto } from './dto/create-tracking.dto';
import { QueryTrackingDto } from './dto/query-tracking.dto';

@Controller('tracking')
export class TrackingController {
  constructor(private readonly service: TrackingService) {}

  @Post()
  async create(@Body() dto: CreateTrackingDto) {
    return await this.service.create(dto);
  }

  @Get('by-date')
  async findByDate(@Query() query: QueryTrackingDto) {
    return await this.service.findByDate(query);
  }
}
