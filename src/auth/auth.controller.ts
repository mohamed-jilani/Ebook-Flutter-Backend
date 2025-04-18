import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDocument } from 'src/users/schemas/user.schema';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(
        @Body() body: { email: string; password: string }
    ) {
        const { email, password } = body;
        const user = await this.authService.validateUser(email, password) as UserDocument;
        return {
            message: 'Connexion réussie',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }

}
