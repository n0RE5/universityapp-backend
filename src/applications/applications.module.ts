import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Application } from './applications.model';
import { GroupsModule } from 'src/groups/groups.module';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [ApplicationsService],
  controllers: [ApplicationsController],
  imports: [
    SequelizeModule.forFeature([Application]),
    GroupsModule,
    UsersModule,
    AuthModule
  ]
})
export class ApplicationsModule {}
