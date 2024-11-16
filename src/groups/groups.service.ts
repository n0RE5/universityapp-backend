import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { IGetScheduleResponse, IUniversityGroup } from './types/types';
import { Cron } from '@nestjs/schedule';
import { Group } from './groups.model';
import { InjectModel } from '@nestjs/sequelize';
import getWeekNumber from './utils/get-week-number';
import { v6 } from 'uuid';
import { UserJWTPayload } from 'src/auth/types/types';
import { TELEGRAM_BOT_API_URL } from 'src/shared/utils/consts';
import { UsersService } from 'src/users/users.service';
import formatDate from 'src/shared/utils/formatDate';
import ContactHeadmanDto from './dto/contact-headman.dto';

@Injectable()
export class GroupsService {
    constructor(
        @InjectModel(Group) private groupRepository: typeof Group,
        private readonly httpService: HttpService,
        private readonly userService: UsersService
    ) {}

    async fetchGroupList() {
        const observable = this.httpService.get<IUniversityGroup[]>('/v1/search/group?groupName=', {
            baseURL: 'https://study.miigaik.ru/api/'
        })
        const response = await firstValueFrom(observable)
        return response.data
    }

    async findAll() {
        const groups = await this.groupRepository.findAll()
        return groups
    }

    async findByPk(id: string) {
        const group = await this.groupRepository.findOne({
            where: {
                id
            }
        })
        if (!group) {
            throw new HttpException({
                message: 'Group has no headman',
                error_id: 'group_has_no_headman'
            }, 404)
        }
        return group
    }

    async contact(dto: ContactHeadmanDto, jwt: UserJWTPayload) {
        const user = await this.userService.findOne(jwt.id)
        const group = await this.groupRepository.findOne({
            where: {
                id: jwt.groupId as string    
            }
        })
        if (!group) {
            throw new HttpException({
                message: 'Join group before accessing contacts',
                error_id: 'group_is_null'
            }, 422)
        }
        const headman = await this.userService.getById(group.headmanId)
        if (!headman) {
            throw new HttpException({
                message: 'Group has no headman',
                error_id: 'group_has_no_headman'
            }, 422)
        }
        try {
            const timestamp = formatDate(new Date())
            const message_payload = `<blockquote><b>От кого:</b> ${user.firstName} ${user.lastName} ${user.username ? `<b>@${user.username}</b>`: ''}%0A<b>Дата:</b> ${timestamp}</blockquote>%0A<b>Сообщение:</b> ${dto.message}`
            const observable = this.httpService.get(`${TELEGRAM_BOT_API_URL}sendMessage?chat_id=${headman.telegramId}&text=${message_payload}&parse_mode=HTML`)
            await firstValueFrom(observable)
            return
        } catch(e) {
            console.log(e)
            throw new HttpException({
                message: 'Interval server error',
                error_id: 'internal_error'
            }, 500)
        }
    }

    async findBySomeId(some_id: string | number) {
        let group
        // silly fix of sql type validation error
        if (typeof some_id === 'number') {
            group = await this.groupRepository.findOne({
                where: {
                    externalId: some_id
                }
            })
        } else {
            group = await this.groupRepository.findOne({
                where: {
                    id: some_id
                }
            })
        }

        if (!group) {
            throw new HttpException({
                message: 'Group with given id not found',
                error_id: 'group_not_found'
            }, 404)
        }
        return group
    }

    async getGroupScheduleSafe(group_id: string, date: string) {
        const group = await this.findBySomeId(group_id)
        try {
            const currentWeekNumber = getWeekNumber(new Date(date))
            const observable = this.httpService.get<IGetScheduleResponse[]>(`/v1/group/${group.externalId}/${currentWeekNumber}`, {
                baseURL: 'https://study.miigaik.ru/api/'
            })
            const response = await firstValueFrom(observable)
            return response.data
        } catch (e) {
            throw new HttpException({
                message: 'Error occured while loading schedule',
                error_id: 'schedule_request_rejected'
            }, 500)
        }
    }

    async getGroupScheduleUnsafe(group_id: string, week: string) {
        try {
            const observable = this.httpService.get<IGetScheduleResponse[]>(`/v1/group/${group_id}/${week}`, {
                baseURL: 'https://study.miigaik.ru/api/'
            })
            const response = await firstValueFrom(observable)
            return response.data
        } catch (e) {
            throw new HttpException({
                message: 'Error occured while loading schedule',
                error_id: 'schedule_request_rejected'
            }, 500)
        }
    }

    @Cron('0 10 * * * *')
    async handleUpdateGroups() {
        const groupList = await this.fetchGroupList()
        for (let externalGroup of groupList) {
            const group = await this.groupRepository.findOne({
                where: {
                    externalId: externalGroup.id
                }
            })
            if (!group) {
                await this.groupRepository.create({
                    id: v6(),
                    externalId: externalGroup.id,
                    name: externalGroup.groupName
                })
            } else {
                await group.update({
                    name: externalGroup.groupName
                })
            }
        }
    }
}
