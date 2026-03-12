import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { AuthGuard, JwtPayload } from '../auth/auth-guard';
import { SignupInputDto } from '@/modules/account/usecase/signup/signup.usecase.dto';
import { LoginInputDto } from '@/modules/account/usecase/login/login.usecase.dto';

@Controller('auth')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  // POST /auth/signup
  @Post('signup')
  async signup(@Body() body: SignupInputDto) {
    return this.accountService.signup(body);
  }

  // POST /auth/login
  @Post('login')
  async login(@Body() body: LoginInputDto) {
    return this.accountService.login(body);
  }

  // GET /auth/me
  @UseGuards(AuthGuard)
  @Get('me')
  async me(@Request() req: { user: JwtPayload }) {
    return this.accountService.findOne({
      memberId: req.user.memberId,
    });
  }
}
