import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtUserParams } from 'src/auth/auth.decorator';
import { UserJWTPayload } from 'src/auth/types/types';
import GetMeDto from './dto/get-me.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}

    @UseGuards(AuthGuard)
    @Get('/get/me')
    async getMe(@JwtUserParams() jwt: UserJWTPayload) {
        const me = await this.userService.getMe(jwt)
        return new GetMeDto(me)
    }
}
