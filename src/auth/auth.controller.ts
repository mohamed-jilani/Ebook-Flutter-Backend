import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: { email: string; password: string }
  ) {
    const { email, password } = body;
    const user = await this.authService.validateUser(email, password);
    return {
      message: 'Connexion réussie',
      user,
    };
  }
}
