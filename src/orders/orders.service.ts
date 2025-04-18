import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
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

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return this.orderModel.find({ userId }).populate('items.bookId');
  }

  async getAllOrders(): Promise<Order[]> {
    return this.orderModel.find().populate('items.bookId userId');
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    order.status = status as any;
    return order.save();
  }

  async getOrderById(orderId: string): Promise<Order> {
    const order = await this.orderModel.findById(orderId).populate('items.bookId userId');
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
}
