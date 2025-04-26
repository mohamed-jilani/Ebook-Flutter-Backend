import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {}

  async create(data: Partial<Category>) {
    const category = new this.categoryModel(data);
    return category.save();
  }
  async createBulk(categories: Partial<Category>[]) {
    // Solution 1: InsertMany (plus performant)
    return this.categoryModel.insertMany(categories, { ordered: false });
    
    /* 
    // Solution 2: Avec validation et hooks (si nécessaire)
    const createdCategories = await Promise.all(
      categories.map(cat => {
        const category = new this.categoryModel(cat);
        return category.save();
      })
    );
    return createdCategories;
    */
  }

  async findAll() {
    return this.categoryModel.find();
  }

  async findById(id: string) {
    return this.categoryModel.findById(id);
  }

  async update(id: string, data: Partial<Category>) {
    const updated = await this.categoryModel.findByIdAndUpdate(id, data, { new: true });
    if (!updated) throw new NotFoundException('Catégorie non trouvée');
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.categoryModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Catégorie non trouvée');
    return deleted;
  }
}
