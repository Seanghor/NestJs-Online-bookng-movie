import { PartialType } from '@nestjs/mapped-types';
import { CreateCampusDto } from './create-campus.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateCampusDto extends PartialType(CreateCampusDto) {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    address: string

    @IsNotEmpty()
    phone: string
}

// export class CampusFilterStatusEnum {
//     date: any
//     movie
// }
export enum CampusFilterStatusEnum {
    date = 'date',
    movie = 'movie',
  }