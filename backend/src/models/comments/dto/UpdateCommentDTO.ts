import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateCommentDTO } from './CreateCommentDTO';

export class UpdateCommentDTO extends PartialType(OmitType(CreateCommentDTO, ['post'] as const)) {}