import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { GroupsService } from './groups.service';
import GetScheduleQueryDto from './dto/get-schedule-query.dto';
import { GroupDto } from './dto/group.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { JwtUserParams } from 'src/auth/auth.decorator';
import { UserJWTPayload } from 'src/auth/types/types';
import { ApiTags } from '@nestjs/swagger';
import ContactHeadmanDto from './dto/contact-headman.dto';

@ApiTags('Groups')
@Controller('groups')
export class GroupsController {
    constructor(private groupService: GroupsService) {}

    @UseGuards(AuthGuard)
    @Get('/get')
    async getGroups(): Promise<GroupDto[]> {
        const groups = await this.groupService.findAll()
        return groups.map(group => new GroupDto(group))
    }

    @UseGuards(AuthGuard)
    @Get('/get/:id')
    async getGroup(@Param('id') id: string): Promise<GroupDto> {
        const group = await this.groupService.findBySomeId(id)
        return new GroupDto(group)
    }

    @UseGuards(AuthGuard)
    @Get('/get/schedule/:group_id')
    async getGroupSchedule(@Param('group_id') group_id: string, @Query() query: GetScheduleQueryDto) {
        const schedule = await this.groupService.getGroupScheduleSafe(group_id, query.date)
        return schedule
    }

    @UseGuards(AuthGuard)
    @Post('/contact_headman')
    contactHeadman(@Body() dto: ContactHeadmanDto, @JwtUserParams() jwt: UserJWTPayload): Promise<void> {
        return this.groupService.contact(dto, jwt)
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles('GOD')
    @Post('/update')
    updateGroups(): Promise<void> {
        return this.groupService.handleUpdateGroups()
    }
}
