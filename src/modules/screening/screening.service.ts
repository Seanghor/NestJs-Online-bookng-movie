import { Auditorium } from './../auditorium/entities/auditorium.entity';
import { Movie } from '@prisma/client';
import { Screening } from './entities/screening.entity';

import { prisma } from './../../../prisma/db';
import { Injectable } from '@nestjs/common';
import { CreateScreeningDto } from './dto/create-screening.dto';
import { UpdateScreeningDto } from './dto/update-screening.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SeatStatusEnum } from '@prisma/client';
import { GenerateCustomIDService } from 'src/utils/customId';
import { CustomDateTimeService } from 'src/utils/dateTimeCustome.service';


@Injectable()
export class ScreeningService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly customeIdService: GenerateCustomIDService,
    private readonly customeDateTimeService: CustomDateTimeService) { }

  async createScreening(createScreeningDto: CreateScreeningDto) {
    // 1- create screen:
    const screening = await this.prisma.screening.create({
      data: createScreeningDto,
    })

    // 2-fine auditurium:
    const auditorium = await this.prisma.auditorium.findUnique({
      where: {
        id: screening.auditoriumId
      }
    })

    // 3- create seat:
    const arrayCustomId = this.customeIdService.generateSeatCustomId()
    const maxSeat = auditorium.num_seats
    for (let j = 1; j <= maxSeat; j++) {
      await prisma.seat.create({
        data: {
          // customId: `A-${j}`,
          customId: arrayCustomId[j - 1],
          auditoriumId: auditorium.id,
          status: SeatStatusEnum.AVAILABLE,
          screeningId: screening.id
        }
      })
    }
    return screening
  }

  async findAll(movie?: string, groupBy?: string, date?: string) {
    const id = Number(movie);
    // console.log("Is number:", !isNaN(id));

    // get all where id
    if (movie && !isNaN(Number(movie)) && !groupBy && !date) {
      console.log("1111");

      const res = await this.prisma.screening.findMany({
        where: {
          movieId: +id
        },
        orderBy:
        {
          "startTime": "asc"
        },
        include: {
          auditorium: true
        }
      })
      return res
    }

    // get all group by date
    else if (movie && !isNaN(Number(movie)) && groupBy === "date") {
      console.log("Just group by date", movie);

      const res = await this.prisma.screening.findMany({
        where: {
          movieId: +id
        },
        orderBy: [
          { "date_show": "asc" },
          { "startTime": "asc" }
        ],

        include: {
          auditorium: true
        }
      })

      
      const result = [];
      let currentDate = null;
      let currentGroup = null;

      for (const item of res) {
        const itemDate = item.date_show.toISOString().split('T')[0].slice(0); // Extract yy-mm-dd

        if (itemDate !== currentDate) {
          currentDate = itemDate;
          currentGroup = [];
          result.push({
            date: itemDate,
            group: currentGroup,
          });
        }

        currentGroup.push(item);
      }
    
      return result
    }

    // get all by id adn date by, group by date
    else if (movie && !isNaN(Number(movie)) && date && (groupBy === "cinema")) {
      console.log("find by movie and date");
      const res = await this.prisma.campus.findMany({
        where: {
          Screening: {
            some: {
              movieId: id,
              date_show: {
                gte: new Date(`${date}T00:00:00Z`),
                lt: new Date(`${date}T23:59:59Z`),
              },
            },
          },
        },
        include: {
          Screening: {
            where: {
              movieId: id,
              date_show: {
                gte: new Date(`${date}T00:00:00Z`),
                lt: new Date(`${date}T23:59:59Z`),
              },
            },
            orderBy:
            {
              "startTime": "asc"
            },
          },

        },
      });

      const groupedCampuses = res.map((campus) => {
        const screeningArray = campus.Screening.map((screening) => ({
          id: screening.id,
          movieId: screening.movieId,
          auditoriumId: screening.auditoriumId,
          date_show: screening.date_show instanceof Date ? screening.date_show.toISOString() : screening.date_show,
          duration_min: screening.duration_min,
          startTime: screening.startTime,
          endTime: screening.endTime instanceof Date ? screening.endTime.toISOString() : screening.endTime,
          status: screening.status,
          isAvailable: screening.isAvailable,
          createdAt: screening.createdAt,
          updatedAt: screening.updatedAt,
        }));

        return {
          id: campus.id,
          name: campus.name,
          address: campus.address,
          phone: campus.phone,
          map: campus.map,
          Screening: [
            {
              date,
              auditoriumId: screeningArray.length > 0 ? screeningArray[0].auditoriumId : '',
              group: screeningArray,
            },
          ],
        };
      });

      return groupedCampuses;

    }
    // get all group by cinema
    else if (movie && !isNaN(Number(movie)) && !date && (groupBy === "cinema")) {
      console.log("just group by cinema");

      const res = await this.prisma.campus.findMany({
        where: {
          Screening: {
            some: {
              movieId: id,
            },
          },
        },
        include: {
          Screening: {
            where: {
              movieId: id
            }
          }
        },
      });
      // Perform additional grouping manually
      const groupedCampuses = res.map((campus) => {
        const groupedScreenings = {};

        campus.Screening.forEach((screening) => {
          const date_show = screening.date_show.toISOString().split('T')[0];

          if (!groupedScreenings[date_show]) {
            groupedScreenings[date_show] = [];
          }

          groupedScreenings[date_show].push(screening);
        });

        const screeningArray = Object.entries(groupedScreenings).map(([date, group]: any) => {
          return {
            date,
            group: group.map((screening) => ({
              id: screening.id,
              movieId: screening.movieId,
              auditoriumId: screening.auditoriumId,
              date_show: screening.date_show instanceof Date ? screening.date_show.toISOString() : screening.date_show,
              duration_min: screening.duration_min,
              startTime: screening.startTime,
              endTime: screening.endTime instanceof Date ? screening.endTime.toISOString() : screening.endTime,
              status: screening.status,
              isAvailable: screening.isAvailable,
              createdAt: screening.createdAt,
              updatedAt: screening.updatedAt,
            })),
          };
        });

        return {
          id: campus.id,
          name: campus.name,
          address: campus.address,
          phone: campus.phone,
          map: campus.map,
          Screening: screeningArray,
        };
      });
      return groupedCampuses
    }
    // get all by title
    else if (movie && isNaN(id)) {
      const res = await this.prisma.screening.findMany({
        where: {
          movie: {
            title: movie.toLocaleLowerCase()
          }
        },
        include: {
          auditorium: true
        }
      })
      // make dimensional array different by show_date:
      const result = [];
      let currentDate = null;
      let currentGroup = null;

      for (const item of res) {
        const itemDate = item.date_show.toISOString().split('T')[0];
        console.log(itemDate);


        if (itemDate !== currentDate) {
          currentDate = itemDate;
          currentGroup = [];
          result.push({
            date: itemDate,
            group: currentGroup,
          });
        }

        currentGroup.push(item);
      }

      return result;
    }

    // find all
    console.log("final");

    const res = await this.prisma.screening.findMany()
    return res
  }

  async findOne(id: number) {
    const res = await this.prisma.screening.findUnique({
      where: {
        id: id
      },
      include: {
        auditorium: true
      }
    })
    return res
  }

  async update(id: number, updateScreeningDto: UpdateScreeningDto) {
    const res = await this.prisma.screening.update({
      where: {
        id: id
      },
      data: updateScreeningDto
    })
    return res
  }



  async remove(id: number) {
    const res = await this.prisma.screening.delete({
      where: {
        id: id
      }
    })
    return res
  }


  async findDistinct(movieId: number, date: string) {
    const res = await this.prisma.campus.findMany({
      where: {
        Screening: {
          some: {

          },
        },
      },
      include: {
        Screening: {
          where: {
            movieId: movieId
          },
          orderBy: {
            "startTime": "asc"
          }
        }
      },
    });

    // Perform additional grouping and filtering manually
    const groupedCampuses = res.map((campus) => {
      const groupedScreenings = {};

      campus.Screening.forEach((screening) => {
        const date_show = screening.date_show.toISOString().split('T')[0];

        console.log("date_show:", date_show);

        if (date_show === date) {
          if (!groupedScreenings[date_show]) {
            groupedScreenings[date_show] = [];
          }

          groupedScreenings[date_show].push(screening);
        }
      });

      const screeningArray = Object.entries(groupedScreenings).map(([date, group]: any) => {
        return {
          date,
          group: group.map((screening) => ({
            id: screening.id,
            movieId: screening.movieId,
            auditoriumId: screening.auditoriumId,
            date_show: screening.date_show instanceof Date ? screening.date_show.toISOString() : screening.date_show,
            duration_min: screening.duration_min,
            startTime: screening.startTime,
            endTime: screening.endTime instanceof Date ? screening.endTime.toISOString() : screening.endTime,
            status: screening.status,
            isAvailable: screening.isAvailable,
            createdAt: screening.createdAt,
            updatedAt: screening.updatedAt,
          })),
        };
      });

      return {
        id: campus.id,
        name: campus.name,
        address: campus.address,
        phone: campus.phone,
        map: campus.map,
        Screening: screeningArray,
      };
    });

    return res
    return groupedCampuses;
  }


  async createMutlipleScreening(
    data: {
      movieId: number,
      dateOfStartShow: string,
      startTimes: string[]
    }
  ) {


    // ---get 7days mor:
    const array7Days = this.customeDateTimeService.generateFuture7Days(data.dateOfStartShow)
    console.log("array7Days:", array7Days);
    const campus = await this.prisma.campus.findMany()

    // ---find movie infor:
    const movie = await this.prisma.movie.findUnique({
      where: {
        id: data.movieId
      }
    })
    // console.log("movie:", movie);

    // ---find duration of movie:
    const duration_min = movie.duration_min
    // console.log("duration_min:", duration_min);

    const res = campus.map(async (eachCampus: any) => {
      console.log("----- CampusId ", eachCampus.id, "---------");
      // find aud of campus:
      const audts = await this.prisma.campus.findUnique({
        where: {
          id: eachCampus.id
        },
        select: {
          auditoriums: {
            select: {
              id: true
            }
          }
        }
      })
      // console.log(audts.auditoriums);
      const arrayAudOfeachCampus = audts.auditoriums
      data.startTimes.map(async (eachTime: string) => {
        const randomAudId = arrayAudOfeachCampus[Math.floor(Math.random() * arrayAudOfeachCampus.length)].id
        let startTime = `1970-01-07T${eachTime}:00.000Z`
        // calculate end time:
        const calculateEndTime = new Date(new Date(startTime).getTime() + duration_min * 60000); // 30 minutes = 30 * 60,000 milliseconds
        const endTime = new Date(calculateEndTime.toISOString());

        console.log(`duration_min  ${duration_min}:  startTime:`, startTime, "--", endTime);



        array7Days.map(async (eachData: string) => {
          let dataShow = new Date(eachData)
          // 1create screen:
          const createScreen = await this.prisma.screening.create({
            data: {
              movieId: data.movieId,
              campusId: eachCampus.id,
              auditoriumId: randomAudId,
              date_show: dataShow,
              duration_min: duration_min,
              startTime: startTime,
              endTime: endTime,
              status: "COMING_SOON",
              isAvailable: true
            }
          })
          // console.log("createScreen:", createScreen);


          // 2- reate auditurium:
          const auditorium = await this.prisma.auditorium.findUnique({
            where: {
              id: randomAudId
            }
          })
          // console.log("auditorium:", auditorium);

          // 3- create seat:
          const arrayCustomId = this.customeIdService.generateSeatCustomId()
          const maxSeat = auditorium.num_seats
          for (let j = 1; j <= maxSeat; j++) {
            await prisma.seat.create({
              data: {
                // customId: `A-${j}`,
                customId: arrayCustomId[j - 1],
                auditoriumId: auditorium.id,
                status: SeatStatusEnum.AVAILABLE,
                screeningId: createScreen.id
              }
            })
          }
        })

      })
    })

    return res


  }

}
