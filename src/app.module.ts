import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { ScheduleModule } from '@nestjs/schedule';
import { User } from './users/users.model';
import { Group } from './groups/groups.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ApplicationsModule } from './applications/applications.module';
import { Application } from './applications/applications.model';
import { RolesModule } from './roles/roles.module';
import { UserRole } from './roles/user-roles.model';
import { Role } from './roles/roles.model';
require('dotenv').config()

@Module({
  imports: [
    UsersModule, 
    GroupsModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: `.env`,
      isGlobal: true
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      dialectOptions: {
          ssl: process.env.DB_REQUIRE_SSL === 'true' && {
              require: true,
              rejectUnauthorized: false
          }
      },
      sync: {
          alter: true
      },
      models: [
        User,
        Group,
        Role,
        UserRole,
        Application
      ],
      autoLoadModels: true,
  }),
    AuthModule,
    ApplicationsModule,
    RolesModule,
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
