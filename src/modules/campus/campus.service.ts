import { Movie } from '@prisma/client';
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
    const currentDate = new Date().toISOString().substring(0, 10);
    console.log("currentDate:", currentDate);
    if (filterBy && (filterBy == 'movie')) {
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

      // format respone --> easy to map for frontend
      const campusResponse = {
        id: res.id,
        name: res.name,
        address: res.address,
        phone: res.phone,
        map: res.map,
        group: Object.values(
          res.Screening.reduce((acc, screening) => {
            const movieId = screening.movieId.toString();
            acc[movieId] = acc[movieId] || {
              movieId: parseInt(movieId),
              movie: screening.movie || null,
              screening: [],
            };
            acc[movieId].screening.push({
              id: screening.id,
              campusId: screening.campusId,
              movieId: screening.movieId,
              auditoriumId: screening.auditoriumId,
              date_show: screening.date_show,
              duration_min: screening.duration_min,
              startTime: screening.startTime,
              endTime: screening.endTime,
              status: screening.status,
              isAvailable: screening.isAvailable,
            });
            return acc;
          }, {})
        ),
      };

      // console.log(campusResponse);
      return campusResponse;


    }
    else if (filterBy && (filterBy == 'date')) {
      console.log("filter by date");
      const res = await this.prisma.screening.findMany({
        where: {
          campusId: id,
          date_show: { gte: new Date(currentDate) }
        }
      })
      return res
    }
    console.log("filter by:", "noooo");
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


  async testFunction(id: number, date: string) {
    const res = await this.prisma.movie.findMany({
      include: {
        Screening: {
          where: {
            date_show: new Date(date),
            campusId: id
          }
        }
      }
    })

    return res
  }
}
