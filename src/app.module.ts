import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary'; // Importez cloudinary ici
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { BooksModule } from './books/books.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // Doit être en premier pour que les variables d'environnement soient disponibles
    MongooseModule.forRoot('mongodb+srv://mohamedjilani551:towCXxQ2fLClC9gZ@cluster0.bq90s0g.mongodb.net/ebook?retryWrites=true&w=majority'),
    UsersModule,
    AuthModule,
    CategoryModule,
    BooksModule,
    CartModule,
    OrdersModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Supprimez la configuration Cloudinary d'ici, elle doit être dans CloudinaryModule
  ],
})
export class AppModule {}