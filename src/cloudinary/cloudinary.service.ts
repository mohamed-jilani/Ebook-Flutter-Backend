import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    folder = 'books',
  ): Promise<string> {
    // Vérification que le fichier est une image
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Le fichier doit être une image');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
          allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return reject(
              new Error('Échec du téléchargement de l image sur Cloudinary'),
            );
          }
          if (!result?.secure_url) {
            return reject(
              new Error('Aucune URL sécurisée retournée par Cloudinary'),
            );
          }
          resolve(result.secure_url);
        },
      );

      const readableStream = new Readable();
      readableStream.push(file.buffer);
      readableStream.push(null); // Indique la fin du stream
      readableStream.pipe(uploadStream);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          console.error('Cloudinary delete error:', error);
          return reject(new Error('Échec de la suppression de l image'));
        }
        if (result.result !== 'ok') {
          return reject(new Error('La suppression a échoué'));
        }
        resolve();
      });
    });
  }
}