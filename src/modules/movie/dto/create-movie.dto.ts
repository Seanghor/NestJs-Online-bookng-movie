import { MovieStatusEnum, MovieTypeEnum } from "@prisma/client";
import { IsEmpty, IsEnum, IsNotEmpty } from "class-validator";

export class CreateMovieDto {
    @IsNotEmpty()
    title: string

    @IsEmpty()
    image: string

    @IsEmpty()
    description: string

    @IsEmpty()
    trailer: string | null;

    @IsEmpty()
    sub_title: string | null;

    @IsNotEmpty()
    movieType: MovieTypeEnum;

    @IsNotEmpty()
    duration_min: number

    @IsNotEmpty()
    rating: number

    @IsNotEmpty()
    price: number

    @IsNotEmpty()
    opening_date: string | Date | null

    isTop: boolean
    isDisable: boolean

    @IsNotEmpty()
    @IsEnum(MovieStatusEnum)
    status: MovieStatusEnum
}

export class ImportMovieDto {
    id: number

    @IsNotEmpty()
    title: string

    @IsEmpty()
    image: string

    @IsEmpty()
    description: string

    @IsEmpty()
    trailer: string | null;

    @IsEmpty()
    sub_title: string;

    @IsNotEmpty()
    movieType: MovieTypeEnum;

    @IsNotEmpty()
    duration_min: number

    @IsNotEmpty()
    rating: number

    @IsNotEmpty()
    price: number

    @IsNotEmpty()
    @IsEnum(MovieStatusEnum)
    status: MovieStatusEnum
}



