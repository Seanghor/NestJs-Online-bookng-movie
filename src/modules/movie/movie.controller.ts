import { prisma } from './../../../prisma/db';
import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseFilters, ClassSerializerInterceptor, UseInterceptors, Query } from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { HttpExceptionFilter } from 'src/model/http-exception.filter';
import { MovieEntity } from './entities/movie.entity';
import { MovieStatus } from '@prisma/client';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) { }

  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async createMovie(@Body() createMovieDto: CreateMovieDto) {
    if (!createMovieDto.title) {
      return new BadRequestException('Title is required')
    }
    const exisitngTitle = await this.movieService.findMovieByTitle(createMovieDto.title)
    if (exisitngTitle) {
      throw new BadRequestException('Movie already exist')
    }
    if (!createMovieDto.image) {
      throw new BadRequestException('Image is required')
    }
    if (!createMovieDto.description) {
      throw new BadRequestException('Description is required')
    }
    if (!createMovieDto.duration_min) {
      throw new BadRequestException('Duration_min is required')
    }
    if (!createMovieDto.rating) {
      throw new BadRequestException('Rating is required')
    }
    if (!createMovieDto.price) {
      throw new BadRequestException('Price is required')
    }
    if (!createMovieDto.status) {
      throw new BadRequestException('Status is required')
    }
    const movie = await this.movieService.createMovie(createMovieDto);
    return new MovieEntity(movie)
  }

  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAllMovies(@Query('title') title?: string, @Query('status') status?: MovieStatus) {
    if (status && !Object.values(MovieStatus).includes(status.toLocaleUpperCase() as MovieStatus)) {
      throw new BadRequestException('Status not valid')
    }
    const movies = await this.movieService.findAllMovie(title, status);
    return movies.map(movie => new MovieEntity(movie))
  }

  @Get(':id')
  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(ClassSerializerInterceptor)
  async findOneMovie(@Param('id') id: string) {
    const res = await this.movieService.findOneMovie(+id)
    if (!res) {
      throw new BadRequestException()
    }
    return new MovieEntity(res)
  }


  @Patch(':id')
  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(ClassSerializerInterceptor)
  async updateMovie(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    const existing = await this.movieService.findOneMovie(+id)
    if (!existing) {
      throw new BadRequestException()
    }
    const exisitngTitle = await this.movieService.findMovieByTitle(updateMovieDto.title)
    if (exisitngTitle) {
      throw new BadRequestException('Title already exists. Please choose a different title.')
    }
    // if (!updateMovieDto.image) {
    //   throw new BadRequestException('Image is required')
    // }
    // if (!updateMovieDto.description) {
    //   throw new BadRequestException('Description is required')
    // }
    // if (!updateMovieDto.duration_min) {
    //   throw new BadRequestException('Duration_min is required')
    // }
    // if (!updateMovieDto.rating) {
    //   throw new BadRequestException('Rating is required')
    // }
    // if (!updateMovieDto.price) {
    //   throw new BadRequestException('Price is required')
    // }
    // if (!updateMovieDto.status) {
    //   throw new BadRequestException('Status is required')
    // }
    const res = await this.movieService.updateOneMovie(+id, updateMovieDto)
    return res
  }


  @Delete(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseFilters(HttpExceptionFilter)
  async removeMovie(@Param('id') id: string) {
    const existing = await this.movieService.findOneMovie(+id)
    if (!existing) {
      throw new BadRequestException()
    }
    const res = await this.movieService.removeMovie(+id)
    return new MovieEntity(res)
  }
}
