import { Controller, Post, Inject } from '@nestjs/common';
import { join } from 'path';
import { CloudinaryService } from './cloudinary.service';

export class CloudinaryController {
    constructor(private readonly cloudinaryService: CloudinaryService) {}

}
