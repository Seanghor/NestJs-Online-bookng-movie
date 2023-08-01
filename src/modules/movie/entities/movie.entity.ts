import { Movie, MovieStatusEnum, MovieTypeEnum } from "@prisma/client";
// import { Exclude } from "class-transformer";

export class MovieEntity implements Movie {
    id: number;
    title: string;
    trailer: string | null;
    movieType: MovieTypeEnum;
    image: string;
    sub_title: string;
    description: string;
    duration_min: number;
    rating: number;
    price: number;
    status: MovieStatusEnum;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<MovieEntity>) {
        Object.assign(this, partial);
    }
    isTop: boolean;
    isDisable: boolean;
    opening_date: Date;
}


export class MovieImportEntity {
    id: number;
    title: string;
    image: string;
    sub_title: string;
    trailer: string | null;
    movieType: MovieTypeEnum;
    description: string;
    duration_min: number;
    rating: number;
    price: number;
    status: MovieStatusEnum;
    opening_date: Date | string;
    constructor(partial: Partial<MovieImportEntity>) {
        Object.assign(this, partial);
    }
    isTop: boolean;
    isDisable: boolean;
}
