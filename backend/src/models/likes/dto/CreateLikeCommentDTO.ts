import { IsMongoId } from "class-validator";

export class CreateLikeCommentDTO {
    @IsMongoId()
    comment: string
}