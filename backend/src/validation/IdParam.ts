import { IsNumberString, IsMongoId } from 'class-validator';

export class IdParam {
  @IsMongoId()
  id: number;
}