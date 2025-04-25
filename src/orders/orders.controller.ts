import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { OrderService } from './orders.service';
import { Order } from './schemas/order.schema';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async placeOrder1(
    @Body('userId') userId: string,
    @Body('items') items: { bookId: string; quantity: number }[],
    @Body('totalPrice') totalPrice: number,
  ): Promise<Order> {
    return this.orderService.placeOrder1(userId, items, totalPrice);
  }

  @Post("place")
  async placeOrder(
    @Body('userId') userId: string,
  ): Promise<Order> {
    return this.orderService.placeOrder(userId);
  }


  @Get('user/:userId')
  async getUserOrders(@Param('userId') userId: string): Promise<Order[]> {
    return this.orderService.getOrdersByUser(userId);
  }

  @Get()
  async getAllOrders(): Promise<Order[]> {
    return this.orderService.getAllOrders();
  }

  @Patch(':orderId/status')
  async updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body('status') status: string,
  ): Promise<Order> {
    return this.orderService.updateOrderStatus(orderId, status);
  }

  @Get(':orderId')
  async getOrderById(@Param('orderId') orderId: string): Promise<Order> {
    return this.orderService.getOrderById(orderId);
  }
}
