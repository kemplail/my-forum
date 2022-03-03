import { ApiProperty } from "@nestjs/swagger";
import { IsDateString } from "class-validator";

export class GetDatedDataDTO {
    @ApiProperty()
    @IsDateString()
    date: Date
}