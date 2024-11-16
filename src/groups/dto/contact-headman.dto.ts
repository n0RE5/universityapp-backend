import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength } from "class-validator";

export default class ContactHeadmanDto {
    @ApiProperty()
    @IsString({ message: 'message must be a string'})
    @MaxLength(1024, {message: 'Too many characters (max: 1024)'})
    message: string
}