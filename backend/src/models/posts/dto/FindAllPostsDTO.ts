import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { FindAllPostsParams } from 'src/services/posts.service';
import { SearchPaginationDTO } from './SearchPaginationDTO';

export class FindAllPostsDTO extends SearchPaginationDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  query: string;

  static toFindAllPostsParams(dto: FindAllPostsDTO): FindAllPostsParams {
    const { query, pageSize, direction, paginationToken } = dto;

    if (direction && paginationToken) {
      return { query, pageSize, direction, paginationToken };
    }

    return { query, pageSize };
  }
}
