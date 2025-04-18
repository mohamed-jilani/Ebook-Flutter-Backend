import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { CartItem, CartItemDocument } from './schemas/cart-item.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>,
    @InjectModel(CartItem.name) private readonly cartItemModel: Model<CartItemDocument>,
  ) {}

  async addToCart(userId: string, items: any[]): Promise<Cart> {
    const savedCartItems: Types.ObjectId[] = [];

    for (const item of items) {
      const cartItem = new this.cartItemModel({
        bookId: item.bookId,
        quantity: item.quantity,
      });

      const savedItem = await cartItem.save();
      savedCartItems.push(savedItem._id as Types.ObjectId);
    }

    const cart = new this.cartModel({
      userId,
      items: savedCartItems,
    });

    return cart.save();
  }

  async getCart(userId: string): Promise<Cart> {
    const cart = await this.cartModel
      .findOne({ userId })
      .populate({
        path: 'items',
        populate: { path: 'bookId' },
      });
    if (!cart) {
      throw new Error('Panier introuvable');
    }
    return cart;
  }

  async getCartItems(userId: string): Promise<CartItem[]> {
    const cart = await this.cartModel
      .findOne({ userId })
      .populate({
        path: 'items',
        populate: { path: 'bookId' },
      });
    if (!cart) throw new Error('Panier introuvable');
    return cart.items as any;
  }

  async removeFromCart(userId: string, bookId: string): Promise<Cart> {
    const cart = await this.cartModel.findOne({ userId }).populate('items');
    if (!cart) throw new Error('Panier introuvable');

    // Supprimer l’item côté CartItem et Cart
    const itemToRemove = cart.items.find((item: any) =>
      item.bookId.toString() === bookId
    );
    if (!itemToRemove) throw new Error('Élément non trouvé');

    await this.cartItemModel.findByIdAndDelete(itemToRemove._id);
    cart.items = cart.items.filter((item: any) =>
      item.bookId.toString() !== bookId
    );
    return cart.save();
  }

  async updateCartItem(
    userId: string,
    bookId: string,
    quantity: number,
  ): Promise<Cart> {
    const cart = await this.cartModel.findOne({ userId }).populate('items');
    if (!cart) throw new Error('Panier introuvable');

    const itemToUpdate = cart.items.find((item: any) =>
      item.bookId.toString() === bookId
    );
    if (!itemToUpdate) throw new Error('Élément non trouvé');

    await this.cartItemModel.findByIdAndUpdate(itemToUpdate._id, {
      quantity,
    });
    return this.getCart(userId);
  }

  async clearCart(userId: string): Promise<Cart> {
    const cart = await this.cartModel.findOne({ userId });
    if (!cart) throw new Error('Panier introuvable');

    await this.cartItemModel.deleteMany({ _id: { $in: cart.items } });
    cart.items = [];
    return cart.save();
  }
}
