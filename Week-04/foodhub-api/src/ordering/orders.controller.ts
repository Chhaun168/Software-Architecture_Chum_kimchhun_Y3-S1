import { Body, Controller, Get, Headers, HttpCode, Param, Patch, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ArrayNotEmpty, IsIn, IsInt, IsString } from 'class-validator';
import { OrdersService } from './orders.service.js';
 
export class CreateOrderDto {
  @IsInt() restaurantId: number;
  @ArrayNotEmpty() @IsString({ each: true }) items: string[];
}

export class UpdateOrderStatusDto {
  @IsIn(['COOKING', 'DELIVERING', 'DELIVERED', 'CANCELLED'])
  status: string;
}
 
@Controller('v1/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(201)
  async create(
    @Body() dto: CreateOrderDto,
    @Headers('idempotency-key') key: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    const order = await this.ordersService.place(dto.restaurantId, dto.items, key);
    if (key) {
      // If retrieved from idempotency cache, return 200 or 201 as appropriate
      res.status(201);
    }
    return order;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.ordersService.get(id);
  }

  @Patch(':id')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return await this.ordersService.changeStatus(id, dto.status);
  }
}