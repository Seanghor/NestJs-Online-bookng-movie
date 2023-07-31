import { Injectable } from '@nestjs/common';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatStatusDto } from './dto/update-seat.dto';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class SeatService {
  constructor(private prisma: PrismaService) { }

  create(createSeatDto: CreateSeatDto) {
    return 'This action adds a new seat' + createSeatDto;
  }

  // async findAll(auditoriumId?: number, screeningId?: number) {
  //   if (screeningId && !auditoriumId) {
  //     const res = await this.prisma.seat.findMany({
  //       where: {
  //         screeningId: screeningId
  //       },
  //       orderBy: {
  //         id: 'asc'
  //       }
  //     })
  //     // ------------------------------------------
  //     // Normal array
  //     const normalArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  //     // Dimensions of the desired array
  //     const rows = 10;
  //     const columns = 6;
  //     // Create the array with rows and columns
  //     const arrayWithRowsColumns = [];

  //     // Iterate over the normal array and organize elements into rows and columns
  //     for (let i = 0; i < rows; i++) {
  //       const row = [];
  //       for (let j = 0; j < columns; j++) {
  //         const element = res[i * columns + j];
  //         row.push(element);
  //       }
  //       arrayWithRowsColumns.push(row);
  //     }
  //     // Print the array with rows and columns
  //     // arrayWithRowsColumns.forEach(row => console.log(row));
  //     console.log("------------------ Start -------------------");
  //     console.log(arrayWithRowsColumns);
  //     console.log("-------------------- Finish ----------------");

  //     return arrayWithRowsColumns
  //     // -------------------------------------
  //   }
  //   if (auditoriumId && !screeningId) {
  //     const res = await this.prisma.seat.findMany({
  //       where: {
  //         auditoriumId: auditoriumId
  //       },
  //       orderBy: {
  //         id: 'asc'
  //       }
  //     })
  //     // ------------------------------------------
  //     // Normal array
  //     const normalArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  //     // Dimensions of the desired array
  //     const rows = 10;
  //     const columns = 6;
  //     // Create the array with rows and columns
  //     const arrayWithRowsColumns = [];

  //     // Iterate over the normal array and organize elements into rows and columns
  //     for (let i = 0; i < rows; i++) {
  //       const row = [];
  //       for (let j = 0; j < columns; j++) {
  //         const element = res[i * columns + j];
  //         row.push(element);
  //       }
  //       arrayWithRowsColumns.push(row);
  //     }
  //     // Print the array with rows and columns
  //     // arrayWithRowsColumns.forEach(row => console.log(row));
  //     console.log("------------------ Start -------------------");
  //     console.log(arrayWithRowsColumns);
  //     console.log("-------------------- Finish ----------------");

  //     return arrayWithRowsColumns
  //     // -------------------------------------
  //   }
  //   const res = await this.prisma.seat.findMany()
  //   return res
  // }


  async findAll(auditoriumId?: number, screeningId?: number) {
    const whereCondition = {};

    if (screeningId && !auditoriumId) {
      whereCondition['screeningId'] = screeningId;
    } else if (auditoriumId && !screeningId) {
      whereCondition['auditoriumId'] = auditoriumId;
    }

    const res = await this.prisma.seat.findMany({
      where: whereCondition,
      orderBy: {
        id: 'asc'
      }
    });

    const seatFormat = [4, 10, 4];
    const totalSeats = seatFormat.reduce((sum, num) => sum + num, 0);
    const arrayWithRowsColumns = [];

    let currentIndex = 0;

    while (currentIndex < res.length) {
      const row = [];
      for (const seatsInRow of seatFormat) {
        const rowSeats = res.slice(currentIndex, currentIndex + seatsInRow);
        currentIndex += seatsInRow;
        row.push(rowSeats);
      }
      arrayWithRowsColumns.push(row);
    }

    return arrayWithRowsColumns;
  }



  async updateStatus(id: number, updateStatus: UpdateSeatStatusDto) {
    return await this.prisma.seat.update({
      where: {
        id
      },
      data: {
        status: updateStatus.status
      }
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} seat`;
  }

  update(id: number, updateSeatDto: UpdateSeatStatusDto) {
    return `This action updates a #${id} seat ${updateSeatDto}`;
  }
  remove(id: number) {
    return `This action removes a #${id} seat`;
  }
}
