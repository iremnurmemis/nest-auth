import { Controller , Get, UseGuards,Req, Body, Post} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { SignUpDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { SetPasswordDto } from './dtos/set-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req){

  }

  @Get('google-redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req){
    return this.authService.googleLogin(req);

  }

  @Post('signUp')
  async signUp(@Body() signUpDto:SignUpDto){
    return this.authService.signUp(signUpDto)
  }


  @Post('logIn')
  async logIn(@Body() loginDto:LoginDto){
    return this.authService.logIn(loginDto);
  }
  
  @Post('changePassword')
  async changePassword(@Body() changePasswordDto:ChangePasswordDto){
    return this.authService.changePassword(changePasswordDto);
  }

  @Post('set-password')
  async setPassword(@Body() setPasswordDto: SetPasswordDto) {
      return this.authService.setPassword(setPasswordDto);
  }
  

}
