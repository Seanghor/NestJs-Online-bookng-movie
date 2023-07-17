import { BadRequestException, ClassSerializerInterceptor, Injectable, UseFilters, UseInterceptors } from '@nestjs/common';
import { CreateCampusDto } from './dto/create-campus.dto';
import { UpdateCampusDto } from './dto/update-campus.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpExceptionFilter } from 'src/model/http-exception.filter';

@Injectable()
export class CampusService {
  constructor(private readonly prisma: PrismaService) { }

  async findUniqueByName(name?: string) {
    const existing = await this.prisma.campus.findUnique({
      where: {
        name: name
      }
    })
    return existing
  }

  async createCampus(createCampusDto: CreateCampusDto) {
    const res = await this.prisma.campus.create({
      data: createCampusDto
    })
    return res
  }

  async findAllCampus() {
    const res = await this.prisma.campus.findMany()
    return res
  }

  async findOneCampus(id: number, filterBy?: string) {
    if (filterBy && (filterBy == 'date')) {
      console.log("dfsjgfhsgfsu");
      const res = await this.prisma.campus.findUnique({
        where: {
          id: id,
        },
        include: {
          Screening: {
            select: {
              id: true,
              campusId: true,
              movieId: true,
              auditoriumId: true,
              date_show: true,
              duration_min: true,
              startTime: true,
              endTime: true,
              status: true,
              isAvailable: true,
              movie: true,
            },
          },
        },
      });

      const screeningsByMovieId: { [movieId: string]: any } = {};

      res.Screening.forEach((screening) => {
        const movieId = screening.movieId.toString();
        if (!screeningsByMovieId[movieId]) {
          screeningsByMovieId[movieId] = {
            movieId: parseInt(movieId),
            screening: [],
          };
        }
        screeningsByMovieId[movieId].screening.push(screening);
      });

      const group: { movieId: number; screening: any[] }[] = Object.values(
        screeningsByMovieId
      );

      const campusResponse: any = {
        id: res.id,
        name: res.name,
        address: res.address,
        phone: res.phone,
        map: res.map,
        group: group,
      };

      // console.log(cinemaResponse);
      return campusResponse;

    }
    console.log("filter by:", "lol");
    const res = await this.prisma.campus.findUnique({
      where: {
        id: id
      }
    })
    return res
  }

  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(ClassSerializerInterceptor)
  async updateCampus(id: number, updateCampusDto: UpdateCampusDto) {
    const existingCampus = await this.prisma.campus.findUnique({
      where: {
        id: id
      }
    })
    if (updateCampusDto.name && updateCampusDto.name !== existingCampus.name) {
      const existingName = await this.prisma.campus.findUnique({
        where: {
          name: updateCampusDto.name
        }
      })
      if (existingName) {
        throw new BadRequestException('Name already exists. Please choose a different Name.')
      }
    }

    const res = await this.prisma.campus.update({
      where: {
        id: id
      },
      data: updateCampusDto
    })
    return res
  }

  async remove(id: number) {
    const res = await this.prisma.campus.delete({
      where: {
        id: id
      }
    })
    return res
  }
}
