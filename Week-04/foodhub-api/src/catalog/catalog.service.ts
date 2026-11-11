import { Injectable } from '@nestjs/common';
import { CatalogRepository, Restaurant } from './catalog.repository.js';

@Injectable()
export class CatalogService {
  constructor(private readonly catalogRepo: CatalogRepository) {}

  findAll(): Restaurant[] {
    return this.catalogRepo.findAll();
  }

  restaurantExists(id: number): boolean {
    return this.catalogRepo.exists(id);
  }
}