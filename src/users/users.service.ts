import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { v6 } from 'uuid';
import CreateUserDto from './dto/create-user-dto';
import { RolesService } from 'src/roles/roles.service';
import { Role } from 'src/roles/roles.model';
import { UserJWTPayload } from 'src/auth/types/types';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User) private userRepository: typeof User,
        private roleService: RolesService
    ) {}
    
    async create(dto: CreateUserDto) {
        const user = await this.userRepository.create({
            id: v6(),
            ...dto
        })
        const role = await this.roleService.getRoleOrCreate("USER")
        await user.$set('roles', [role.id])
        user.roles = [role]
        return user
    }

    async getByTelegramId(telegramId: number) {
        return await this.userRepository.findOne({
            where: {
                telegramId
            },
            include: [
                {
                    model: Role,
                    as: 'roles'
                }
            ]
        })
    }

    async getMe(jwt: UserJWTPayload) {
        const user = await this.userRepository.findOne({
            where: {
                id: jwt.id
            }
        })
        if (!user) {
            throw new HttpException({
                message: 'User with given id not found (record deleted)?',
                error_id: 'user_not_found'
            }, 404)
        }
        return user
    }

    async getById(id: string) {
        const user = await this.userRepository.findOne({
            where: {
                id
            }
        }) 
        return user
    }

    async findOne(id: string) {
        const user = await this.userRepository.findOne({
            where: {
                id
            }
        })
        if (!user) {
            throw new HttpException({
                message: 'User with given id not found',
                error_id: 'user_not_found'
            }, 404)
        }
        return user
    }
}
