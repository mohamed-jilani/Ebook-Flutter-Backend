import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderService } from './orders.service';
import { OrderController } from './orders.controller';
import { Order, OrderSchema } from './schemas/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: 'Cart', schema: 'Cart' }]),
    MongooseModule.forFeature([{ name: 'Book', schema: 'Book' }]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService], 
})
export class OrdersModule {}
