import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './roles.model';

@Injectable()
export class RolesService {
    constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

    async getRoleOrCreate(name: string) {
        const role = await this.roleRepository.findOne({
            where: {
                name
            }
        })
        if (!role) {
            const created = await this.roleRepository.create({
                name
            })
            return created
        }
        return role
    }
}
