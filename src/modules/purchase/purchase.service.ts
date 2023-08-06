import { Injectable } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PurchaseService {
  constructor(private prisma: PrismaService) { }


  async create(createPurchaseDto: CreatePurchaseDto) {
    const purchase = await this.prisma.purchase.create({
      // data: {
      //   ...createPurchaseDto,
      //   bookings: {
      //     connect: [{ id: 1 }, { id: 2 }],
      //   },
      // },
      data: createPurchaseDto,
      include: {
        bookings: true,
      },
    });
    return purchase
  }

  findAll() {
    return `This action returns all purchase`;
  }

  findOne(id: number) {
    return `This action returns a #${id} purchase`;
  }

  update(id: number, updatePurchaseDto: UpdatePurchaseDto) {
    return `This action updates a #${id} purchase`;
  }

  remove(id: number) {
    return `This action removes a #${id} purchase`;
  }
}
