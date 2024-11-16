import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class InitUserDto {
    @ApiProperty()
    @IsString({message: 'initData must be a string'})
    initData: string
}