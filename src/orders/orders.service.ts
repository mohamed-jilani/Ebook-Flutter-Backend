import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel('Cart') private readonly cartModel: Model<any>, 
    @InjectModel('Book') private readonly bookModel: Model<any>, 
    ) {}

  async placeOrder1(userId: string, items: { bookId: string; quantity: number }[], totalPrice: number): Promise<Order> {
    const newOrder = new this.orderModel({
      userId,
      items,
      totalPrice,
      status: 'pending',
    });
    return newOrder.save();
  }
  async placeOrder(userId: string): Promise<Order> {
    const cart = await this.cartModel.findOne({ userId }).populate('items');
  
    if (!cart || cart.items.length === 0) {
      throw new NotFoundException('Cart is empty or not found');
    }
  
    const orderItems: { bookId: Types.ObjectId; quantity: number }[] = [];
    let totalPrice = 0;
  
    for (const cartItem of cart.items) {
      const book = await this.bookModel.findById(cartItem.bookId);
      if (!book) continue;
  
      orderItems.push({
        bookId: book._id as Types.ObjectId,
        quantity: cartItem.quantity as number,
      });
  
      totalPrice += book.price * cartItem.quantity;
    }
  
    const newOrder = new this.orderModel({
      userId,
      items: orderItems,
      totalPrice,
      status: 'pending',
    });
  
    // Optionnel : vider le panier après la commande
    cart.items = [];
    await cart.save();
  
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
