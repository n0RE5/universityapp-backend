import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { JwtUserParams } from 'src/auth/auth.decorator';
import { UserJWTPayload } from 'src/auth/types/types';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ApiTags } from '@nestjs/swagger';
import { ApplicationDto } from './dto/application.dto';

@ApiTags('Applications')
@Controller('applications')
export class ApplicationsController {
    constructor(private applicationService: ApplicationsService) {}

    @UseGuards(AuthGuard)
    @Post('/join/:group_id')
    createApplication(@Param('group_id') group_id: string, @JwtUserParams() jwt: UserJWTPayload): Promise<void> {
        return this.applicationService.create(group_id, jwt)
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles('HEADMAN')
    @Get('/get')
    async getApplications(@JwtUserParams() jwt: UserJWTPayload): Promise<ApplicationDto[]> {
        const applications = await this.applicationService.findByGroup(jwt)
        return applications.map(application => new ApplicationDto(application))
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles('HEADMAN')
    @Post('/approve/:application_id')
    approve(@Param('application_id') application_id: string, @JwtUserParams() jwt: UserJWTPayload): Promise<void> {
        return this.applicationService.approve(application_id, jwt)
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles('HEADMAN')
    @Post('/reject/:application_id')
    reject(@Param('application_id') application_id: string, @JwtUserParams() jwt: UserJWTPayload): Promise<void> {
        return this.applicationService.reject(application_id, jwt)
    }
}
