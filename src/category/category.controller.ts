import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() body: { name: string; description?: string }) {
    return this.categoryService.create(body);
  }
  
  // Nouvelle méthode pour plusieurs catégories
  @Post('bulk')
  async createBulk(@Body() categories: { name: string; description?: string }[]) {
    return this.categoryService.createBulk(categories);
  }

  @Get()
  async findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.categoryService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.categoryService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.categoryService.delete(id);
  }
}
