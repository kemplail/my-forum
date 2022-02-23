import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsDateString } from "class-validator";

export class GetDatedDataDTO {
    @ApiProperty()
    @IsDateString()
    date: Date
}