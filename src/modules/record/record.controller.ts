// src/modules/records/controllers/record.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { RecordService } from './record.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { QueryRecordDto } from './dto/query-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';


@Controller('records')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRecordDto: CreateRecordDto) {
    return await this.recordService.create(createRecordDto);
  }

  @Get()
  async findAll(@Query() query: QueryRecordDto) {
    return await this.recordService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.recordService.findOne(id);
  }

  @Get('user/:userId')
  async findByUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return await this.recordService.findByUser(userId);
  }

  @Get('user/:userId/today')
  async getUserRecordsToday(@Param('userId', ParseUUIDPipe) userId: string) {
    return await this.recordService.getUserRecordsToday(userId);
  }

  @Get('user/:userId/status-today')
  async getUserStatusToday(@Param('userId', ParseUUIDPipe) userId: string) {
    return await this.recordService.getUserStatusToday(userId);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRecordDto: UpdateRecordDto,
  ) {
    return await this.recordService.update(id, updateRecordDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.recordService.remove(id);
  }
} 