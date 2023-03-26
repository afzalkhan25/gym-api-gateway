import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDTO } from './dtos/login.dto';
import { SignUpDTO } from './dtos/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authSvc: AuthService) {

  }

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Body() body: LoginDTO) {
    return await this.authSvc.login(body.email, body.password)
  }

  @Post('/signup')
  async signup(@Body() body: SignUpDTO) {
    return await this.authSvc.signup(body);
  }

  signUp(userType:string, mobileNo:string, password:string, email:string, ) {
    
  }

  resetPassword() {
    
  }

  logout() {
    
  }

}
