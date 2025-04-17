import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://mohamedjilani551:towCXxQ2fLClC9gZ@cluster0.bq90s0g.mongodb.net/ebook?retryWrites=true&w=majority'),
    UsersModule,
    AuthModule,
    CategoryModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
