import { Controller, Get, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service.js';

@Controller('v1/restaurants')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  findAll(@Query('limit') limit?: string) {
    const items = this.catalogService.findAll();
    const parsedLimit = limit ? parseInt(limit, 10) : items.length;
    return {
      data: items.slice(0, parsedLimit),
      limit: parsedLimit,
      offset: 0,
      total: items.length,
    };
  }
}