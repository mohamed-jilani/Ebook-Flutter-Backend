import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Delete,
    Put,
  } from '@nestjs/common';
  import { CartService } from './cart.service';
  
  @Controller('cart')
  export class CartController {
    constructor(private readonly cartService: CartService) {}
  
    @Post()
    async addToCart(
      @Body()
      body: {
        userId: string;
        items: { bookId: string; quantity: number }[];
      },
    ) {
      return this.cartService.addToCart(body.userId, body.items);
    }
  
    @Get(':userId')
    async getCart(@Param('userId') userId: string) {
      return this.cartService.getCart(userId);
    }
  
    @Get(':userId/items')
    async getCartItems(@Param('userId') userId: string) {
      return this.cartService.getCartItems(userId);
    }
  
    @Put(':userId/item/:bookId')
    async updateItem(
      @Param('userId') userId: string,
      @Param('bookId') bookId: string,
      @Body() body: { quantity: number },
    ) {
      return this.cartService.updateCartItem(userId, bookId, body.quantity);
    }
  
    @Delete(':userId/item/:bookId')
    async removeItem(
      @Param('userId') userId: string,
      @Param('bookId') bookId: string,
    ) {
      return this.cartService.removeFromCart(userId, bookId);
    }
  
    @Delete(':userId')
    async clearCart(@Param('userId') userId: string) {
      return this.cartService.clearCart(userId);
    }
  }
  