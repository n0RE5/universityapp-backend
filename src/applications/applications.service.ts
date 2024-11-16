import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Application } from './applications.model';
import { InjectModel } from '@nestjs/sequelize';
import { UsersService } from 'src/users/users.service';
import { GroupsService } from 'src/groups/groups.service';
import { ApplicationStatus } from './applications.enum';
import { UserJWTPayload } from 'src/auth/types/types';
import { v6 } from 'uuid';
import { User } from 'src/users/users.model';

@Injectable()
export class ApplicationsService {
    constructor(
        @InjectModel(Application) private applicationRepository: typeof Application,
        private userService: UsersService,
        private groupService: GroupsService
    ) {}

    async create(group_id: string, jwt: UserJWTPayload) {
        const user = await this.userService.findOne(jwt.id)
        const group = await this.groupService.findByPk(group_id)
        await this.applicationRepository.create({
            id: v6(),
            groupId: group.id,
            userId: user.id
        })
        return
    }

    async findByGroup(jwt: UserJWTPayload) {
        const applications = await this.applicationRepository.findAll({
            where: {
                groupId: jwt.groupId as string,
                status: ApplicationStatus.pending
            },
            include: [
                {
                    model: User,
                    as: 'user'
                }
            ]
        })
        return applications
    }

    async getApplicationStatus(jwt: UserJWTPayload) {
        const applications = await this.applicationRepository.findAll({
            where: {
                userId: jwt.id
            }
        })
        return applications
    }

    async approve(id: string, jwt: UserJWTPayload) {
        const application = await this.applicationRepository.findOne({
            where: {
                id
            }
        })
        if (!application) {
            throw new HttpException({
                message: 'Application with given id not found',
                error_id: 'application_not_found'
            }, HttpStatus.NOT_FOUND)
        }
        const user = await this.userService.findOne(application.userId)
        await user.update({
            groupId: application.groupId,
        })
        await application.update({
            status: ApplicationStatus.approved,
            reviewedBy: jwt.id,
            reviewedAt: new Date().toISOString()
        })
        return
    }

    async reject(id: string, jwt: UserJWTPayload) {
        const application = await this.applicationRepository.findOne({
            where: {
                id,
            }
        })
        if (!application) {
            throw new HttpException({
                message: 'Application with given id not found',
                error_id: 'application_not_found'
            }, HttpStatus.NOT_FOUND)
        }
        await application.update({
            status: ApplicationStatus.rejected,
            reviewedBy: jwt.id,
            reviewedAt: new Date().toISOString()
        })
        return
    }
}
