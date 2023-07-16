import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDto } from './create-movie.dto';
import { IsEmpty, IsEnum, IsNotEmpty } from 'class-validator';
import { MovieStatusEnum, MovieTypeEnum } from '@prisma/client';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
    @IsNotEmpty()
    title: string

    @IsEmpty()
    image: string

    @IsEmpty()
    description: string

    trailer: string | null;
    movieType: MovieTypeEnum;

    @IsEmpty()
    sub_title: string;

    @IsNotEmpty()
    duration_min: number

    @IsNotEmpty()
    rating: number

    @IsNotEmpty()
    price: number

    isTop: boolean
    isDisable: boolean

    @IsNotEmpty()
    @IsEnum(MovieStatusEnum)
    status: MovieStatusEnum
}
