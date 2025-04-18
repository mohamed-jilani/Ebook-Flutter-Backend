import { Controller, Post, Body, BadRequestException, NotFoundException, Get, Param, Patch, Delete, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDocument } from './schemas/user.schema';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('register')
    async register(
        @Body() body: { name: string; email: string; password: string; role?: string }
    ) {
        const { name, email, password, role = 'client' } = body;

        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser) {
            throw new BadRequestException('Email déjà utilisé');
        }

        const user = await this.usersService.create(name, email, password, role) as UserDocument;
        return {
            message: 'Utilisateur enregistré avec succès',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }



    @Get()
    async findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const user = await this.usersService.findById(id);
        if (!user) throw new NotFoundException('Utilisateur non trouvé');
        return user;
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() body: Partial<{ name: string; email: string; password: string }>) {
        const updated = await this.usersService.update(id, body);
        return {
            message: 'Utilisateur mis à jour',
            user: updated,
        };
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        const result = await this.usersService.remove(id);
        if (!result.deleted) throw new NotFoundException('Utilisateur non trouvé ou déjà supprimé');
        return { message: 'Utilisateur supprimé' };
    }

}
