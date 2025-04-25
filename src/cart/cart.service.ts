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

  async addToCart0(userId: string, items: any[]): Promise<Cart> {
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
  async addToCart(userId: string, items: any[]): Promise<Cart> {
    let cart = await this.cartModel.findOne({ userId });
  
    if (!cart) {
      // Créer un panier vide si non existant
      cart = new this.cartModel({ userId, items: [] });
      await cart.save();
    }
  
    for (const item of items) {
      const existingItem = await this.cartItemModel.findOne({
        _id: { $in: cart.items },
        bookId: item.bookId,
      });
  
      if (existingItem) {
        // Augmenter la quantité si l’item existe déjà
        existingItem.quantity += item.quantity;
        await existingItem.save();
      } else {
        // Sinon créer un nouveau CartItem
        const newItem = new this.cartItemModel({
          bookId: item.bookId,
          quantity: item.quantity,
        });
        const savedItem = await newItem.save();
        cart.items.push(savedItem._id as Types.ObjectId);
      }
    }
  
    await cart.save();
  
    return cart.populate({
      path: 'items',
      populate: { path: 'bookId' }
    });
  }
  

  async getCart(userId: string): Promise<Cart> {
    const cart = await this.cartModel
      .findOne({ userId: userId })
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
