import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

  export type CartItemDocument = CartItem & Document;
  
  @Schema()
  export class CartItem {
    @Prop({ type: Types.ObjectId, ref: 'Book', required: true })
    bookId: Types.ObjectId;
  
    @Prop({ required: true, min: 1 })
    quantity: number;
  }
  
  export const CartItemSchema = SchemaFactory.createForClass(CartItem);
  