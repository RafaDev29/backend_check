import { SetMetadata } from '@nestjs/common';

export const DYNAMIC_STATUS = 'DYNAMIC_STATUS';
export const DynamicStatus = (status: number) => SetMetadata(DYNAMIC_STATUS, status);
