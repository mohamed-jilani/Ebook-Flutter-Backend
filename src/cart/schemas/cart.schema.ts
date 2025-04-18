import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CartItem } from './cart-item.schema';

export type CartDocument = Cart & Document;

@Schema()
export class Cart {
  @Prop({ required: true })
  userId: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'CartItem' }] })
  items: Types.ObjectId[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
