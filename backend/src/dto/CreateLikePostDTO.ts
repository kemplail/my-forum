import { IsMongoId } from "class-validator";

export class CreateLikePostDTO {
    @IsMongoId()
    post: string
}