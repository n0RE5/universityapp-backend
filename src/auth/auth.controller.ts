import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { InitUserDto } from './dto/init.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/init')
    init(@Body() dto: InitUserDto) {
        return this.authService.initUser(dto)
    }
}
