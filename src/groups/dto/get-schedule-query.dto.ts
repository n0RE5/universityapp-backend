import { ApiProperty } from "@nestjs/swagger";
import { IsISO8601 } from "class-validator";

export default class GetScheduleQueryDto {
    @ApiProperty()
    @IsISO8601({}, { message: 'date must be an iso string' })
    readonly date: string
}