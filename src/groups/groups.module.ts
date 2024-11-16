import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { HttpModule } from '@nestjs/axios';
import { SequelizeModule } from '@nestjs/sequelize';
import { Group } from './groups.model';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [GroupsService],
  controllers: [GroupsController],
  imports: [
    SequelizeModule.forFeature([Group]),
    AuthModule,
    HttpModule,
    UsersModule
  ],
  exports: [
    GroupsService
  ]
})
export class GroupsModule {}
