import { PrismaService } from 'src/prisma/prisma.service';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { SeatService } from './seat.service';
import { SeatController } from './seat.controller';
import { AuditoriumService } from '../auditorium/auditorium.service';
import { ScreeningService } from '../screening/screening.service';
import { IsAuthService } from 'src/middlewares/middlewares.service';
import { GenerateCustomIDService } from 'src/utils/customId';

@Module({
  controllers: [SeatController],
  providers: [SeatService, PrismaService, AuditoriumService, ScreeningService, GenerateCustomIDService ]
})
export class SeatModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IsAuthService)
      // .forRoutes(ScreeningController)
      .exclude(
        { path: 'seat', method: RequestMethod.GET },
      )
      .forRoutes(SeatController);
  }
}
