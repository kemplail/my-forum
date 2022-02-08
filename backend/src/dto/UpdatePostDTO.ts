import { CreatePostDTO } from '../dto/CreatePostDTO';
import { OmitType, PartialType } from '@nestjs/swagger';

export class UpdatePostDTO extends PartialType(
    OmitType(CreatePostDTO, ['author'] as const),
  ) {}