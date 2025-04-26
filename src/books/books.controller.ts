import { Controller, Get, Post, Body, Param, Put, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Book } from './schemas/book.schema';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post("create1")
  create1(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create1(createBookDto);
  }

  @Post()
  @UseInterceptors(FileInterceptor('cover')) 
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createBookDto: CreateBookDto,
  ): Promise<Book> {
    return this.booksService.create(createBookDto, file);
  }

  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Put('update1/:id')
  update1(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update1(id, updateBookDto);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('cover')) 
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string, 
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    return this.booksService.update(id, updateBookDto, file);
  }



  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
