import { HttpException, Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';
import { BOT_TOKEN } from 'src/shared/utils/consts';
import { User } from 'src/users/users.model';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { TelegramUser } from 'src/shared/types/types';
import { UserJWTPayload } from './types/types';
import { InitUserDto } from './dto/init.dto';

@Injectable()
export class AuthService {
    constructor(private userService: UsersService, private jwtService: JwtService) {}

    async initUser(dto: InitUserDto) {
        const initdata = await this.validateInitData(dto.initData)
        const userdata = await this.userFromInitData(initdata)
        let user = await this.userService.getByTelegramId(userdata.id)
        if (!user) {
            user = await this.userService.create({
                firstName: userdata.first_name,
                lastName: userdata.last_name,
                username: userdata.username,
                telegramId: userdata.id,
                photoUrl: userdata.photo_url
            })
        } else {
            user = await user.update({
                firstName: user.firstName ? user.firstName : userdata.first_name,
                lastName: user.lastName ? user.lastName : userdata.last_name,
                photoUrl: userdata.photo_url,
                username: userdata.username || null
            })
        }
        return {
            token: this.signToken(user)
        }
    }

    private signToken(user: User) {
        const payload: UserJWTPayload = {
            id: user.id,
            groupId: user.groupId,
            roles: user.roles.map(role => ({
                name: role.name,
                id: role.id
            }))
        }
        return this.jwtService.sign(payload)
    }


    userFromInitData(initData: string) {
        const urldecoded = decodeURIComponent(initData)
        const kvp = urldecoded.split('&')
        const initDataUnsafe = {}
        kvp.sort().forEach(item => {
            const [key, value] = item.split('=')
            initDataUnsafe[key] = value
        })
        const user: TelegramUser = JSON.parse(initDataUnsafe['user'])
        if (!user) {
            throw new HttpException({
                message: 'Unexpected behaviour, aborting request',
                error_id: 'request_aborted'
            }, 422)
        }
        return user
    }

    async validateInitData(initData: string) {
        const urldecoded = decodeURIComponent(initData)
        
        const kvp = urldecoded.split('&')
        const hash = kvp.pop()?.split('=')[1]
        const dataCheckString = kvp.sort().join('\n')
        
        const secretKey = createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest()
        const _hash = createHmac('sha256', secretKey).update(dataCheckString).digest('hex')

        if (hash !== _hash) {
            throw new HttpException({
                message: 'Nice try, consider other methods',
                error_id: 'invalid_init_data'
            }, 418)
        }

        return initData
    }
}
