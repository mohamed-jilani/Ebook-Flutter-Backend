import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
) {}

  async placeOrder(userId: string, items: { bookId: string; quantity: number }[], totalPrice: number): Promise<Order> {
    const newOrder = new this.orderModel({
      userId,
      items,
      totalPrice,
      status: 'pending',
    });
    return newOrder.save();
  }
}
