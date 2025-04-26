import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create1(createBookDto: CreateBookDto): Promise<Book> {
    const createdBook = new this.bookModel(createBookDto);
    return createdBook.save();
  }

  
  async create(
    createBookDto: CreateBookDto,
    file?: Express.Multer.File,
  ): Promise<Book> {
    try {
      if (file) {
        createBookDto.coverUrl = await this.cloudinaryService.uploadImage(file);
      }

      const createdBook = new this.bookModel(createBookDto);
      return createdBook.save();
    } catch (error) {
      console.error('Error creating book:', error);
      throw error; // ou gérer l'erreur de manière plus spécifique
    }
  }

  async findAll(): Promise<Book[]> {
    return this.bookModel.find().populate('category');
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.bookModel.findById(id).populate('category');
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async update1(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const updatedBook = await this.bookModel.findByIdAndUpdate(id, updateBookDto, { new: true });
    if (!updatedBook) throw new NotFoundException('Book not found');
    return updatedBook;
  }

  async update(
    id: string, 
    updateBookDto: UpdateBookDto,
    file?: Express.Multer.File,
  ): Promise<Book> {
    try {
      if (file) {
        updateBookDto.coverUrl = await this.cloudinaryService.uploadImage(file);
      }

      const updatedBook = await this.bookModel.findByIdAndUpdate(id, updateBookDto, { new: true });
      if (!updatedBook) throw new NotFoundException('Book not found');
      return updatedBook;
    } catch (error) {
      console.error('Error updating book:', error);
      throw error; 
    }
  }

  async remove(id: string): Promise<Book> {
    const deletedBook = await this.bookModel.findByIdAndDelete(id);
    if (!deletedBook) throw new NotFoundException('Book not found');
    return deletedBook;
  }
}
