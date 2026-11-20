import { Module } from '@nestjs/common';
import { RestaurantsController } from './restaurants.controller.js';
import { OrdersController } from './orders.controller.js';
import { AuthController } from './auth.controller.js';
import { OrderingModule } from './ordering/ordering.module.js';

@Module({
  imports: [OrderingModule],
  controllers: [RestaurantsController, OrdersController, AuthController],
})
export class AppModule {}
